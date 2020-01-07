import React from 'react';
import PropTypes from 'prop-types';
import {
    find,
    isObject,
    map,
    range,
} from 'lodash/fp';

import utils, { memoize } from '../../utils';

import './sass/_select-list-component.scss';

import ButtonField from '../ButtonField';
import SingleSelect from '../SingleSelect';

export class SelectListComponent extends React.Component
{
    constructor(props) {
        super(props);
        this.onAdd = this.onAdd.bind(this);
        this.memoize = memoize.bind(this);
    }

    onAdd(id) {
        const {
            options,
            list,
            setState,
            onAdd,
        } = this.props;
        const option = find({id}, options);
        if (option === undefined) {
            return false;
        }
        const { initialItem = {} } = option;
        const update = [
            ...list,
            {...initialItem, type: id},
        ];
        setState(
            update,
            onAdd
                ? () => onAdd(list.length, item)
                : null
        );
    }

    onChange(index) {
        return this.memoize(`change ${index}`, value => {
            const { list, setState, onChange } = this.props;
            const item = isObject(value) ? value : { ...list[index], value };

            const update = [
                ...list.slice(0, index),
                item,
                ...list.slice(index + 1),
            ];
            setState(
                update,
                onChange
                    ? () => onChange(index, list, update)
                    : null
            );
        });
    }

    onSetState(index) {
        return this.memoize(`setState ${index}`, update => {
            const { list } = this.props;
            if (!isObject(update)) {
                this.onChange(index)(update);
                return;
            }
            const item = {
                ...list[index],
                ...update,
            };
            this.onChange(index)(item);
        });
    };

    onDelete(index) {
        return this.memoize(`delete ${index}`, () => {
            const { list, setState, onDelete } = this.props;
            const oldItem = list[index];
            const update = [
                ...list.slice(0, index),
                ...list.slice(index + 1),
            ];
            setState(
                update,
                onDelete
                    ? () => onDelete(index, oldItem)
                    : null
            );
        });
    }

    renderNewItemSelect() {
        const { options, disabled } = this.props;

        if (disabled) {
            return null;
        }
        if (!options.length) {
            return null;
        }

        return (
            <li key="add-button" className="select-list-component__last">
                <SingleSelect
                    items={options}
                    setState={this.onAdd}
                    renderEmpty="Add..."
                    className="select-list-component__add"
                    color="primary"
                    name="add"
                />
            </li>
        );
    }

    render() {
        const { list, options, disabled } = this.props;

        let items = map(
            index => ({
                item: list[index],
                id: list[index].type,
                index,
                disabled,
            })
        )(range(0, list.length));

        return (
            <ul
                className={utils.makeStyle(
                    {disabled},
                    ["select-list-component"]
                )}
            >
                {map(
                    ({item, id, index, disabled}) => {
                        const option = find({id}, options);
                        if (option === undefined) {
                            return;
                        }
                        const {
                            component: Component,
                            componentProps = {},
                        } = option;

                        return (
                            <li key={index}>
                                <Component
                                    {...componentProps}
                                    {...item}
                                    onChange={this.onChange(index)}
                                    setState={this.onSetState(index)}
                                />
                                {!disabled ? (
                                    <ButtonField
                                        className="select-list-component__delete"
                                        name="del"
                                        color="warning"
                                        icon="minus"
                                        label="&#8203;"
                                        onClick={this.onDelete(index)}
                                    />
                                ) : null}
                            </li>
                        )
                    }
                )(items)}
                {this.renderNewItemSelect()}
            </ul>
        );
    }
};

SelectListComponent.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            component: PropTypes.oneOfType([
                PropTypes.element,
                PropTypes.func,
            ]).isRequired,
            componentProps: PropTypes.object,
            initialItem: PropTypes.object,
        })
    ),
    disabled: PropTypes.bool,
    setState: PropTypes.func,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    onAdd: PropTypes.func,
};

SelectListComponent.defaultProps = {
    options: [],
    disabled: false,
    onAdd: null,
    onChange: null,
    onDelete: null,
    setState: (value) => {
        console.log(['SelectListComponent', value]);
    }
};

export default SelectListComponent;
