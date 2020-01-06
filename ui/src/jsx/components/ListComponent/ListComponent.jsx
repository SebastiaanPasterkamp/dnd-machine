import React from 'react';
import PropTypes from 'prop-types';
import {
    isObject,
    map,
    range,
} from 'lodash/fp';

import utils, { memoize } from '../../utils';

import './sass/_list-component.scss';

import ButtonField from '../ButtonField';

export class ListComponent extends React.Component
{
    constructor(props) {
        super(props);
        this.onAdd = this.onAdd.bind(this);
        this.memoize = memoize.bind(this);
    }

    onAdd() {
        const { list, initialItem, setState, onAdd } = this.props;
        const item = {...initialItem};
        const update = [
            ...list,
            item,
        ];
        setState(
            update,
            onAdd
                ? () => onAdd(list.length, item)
                : null
        );
    }

    onChange(index) {
        return this.memoize(`change ${index}`, item => {
            const { list, setState, onChange } = this.props;
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

    renderNewItemButton() {
        const { list, disabled, newItem } = this.props;

        if (disabled) {
            return null;
        }
        if (newItem == 'auto') {
            return null;
        }
        if (newItem == 'initial' && !list.length) {
            return null;
        }

        return (
            <li key="add-button" className="list-component__last">
                <ButtonField
                    className="list-component__add"
                    name="add"
                    color="primary"
                    icon="plus"
                    label="&#8203;"
                    onClick={this.onAdd}
                />
            </li>
        );
    }

    render() {
        const {
            list, component: Component, componentProps,
            initialItem, disabled, newItem,
        } = this.props;

        let items = map(
            index => ({
                item: list[index],
                index,
                disabled,
            })
        )(range(0, list.length));
        if (
            (newItem == 'initial' && !list.length)
            || newItem == 'auto'
        ) {
            items.push({
                item: initialItem,
                index: list.length,
                disabled: true,
            });
        }

        return (
            <ul
                className={utils.makeStyle(
                    {disabled},
                    ["list-component"]
                )}
            >
                {map(
                    ({item, index, disabled}) => (
                        <li key={index}>
                            <Component
                                {...componentProps}
                                {...(isObject(item)
                                    ? item
                                    : { value: item }
                                )}
                                onChange={this.onChange(index)}
                                setState={this.onSetState(index)}
                            />
                            <ButtonField
                                className="list-component__delete"
                                name="del"
                                color="warning"
                                icon="minus"
                                label="&#8203;"
                                disabled={disabled}
                                onClick={this.onDelete(index)}
                            />
                        </li>
                    )
                )(items)}
                {this.renderNewItemButton()}
            </ul>
        );
    }
};

ListComponent.propTypes = {
    list: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number,
        PropTypes.string,
    ])).isRequired,
    component: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]).isRequired,
    componentProps: PropTypes.object,
    initialItem: PropTypes.object,
    newItem: PropTypes.oneOf(['button', 'initial', 'auto']),
    disabled: PropTypes.bool,
    setState: PropTypes.func,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    onAdd: PropTypes.func,
};

ListComponent.defaultProps = {
    initialItem: {},
    componentProps: {},
    disabled: false,
    newItem: 'button',
    onAdd: null,
    onChange: null,
    onDelete: null,
    setState: (value) => {
        console.log(['ListComponent', value]);
    }
};

export default ListComponent;
