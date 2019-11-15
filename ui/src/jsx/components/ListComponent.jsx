import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import utils from '../utils.jsx';

import '../../sass/_list-component.scss';

import LazyComponent from './LazyComponent.jsx';
import ButtonField from './ButtonField.jsx';

export class ListComponent extends LazyComponent
{
    onChange(index, item) {
        const { list, setState, onChange } = this.props;
        const update = _.concat(
            _.slice(list, 0, index),
            item,
            _.slice(list, index+1)
        );
        setState(
            update,
            onChange
                ? () => onChange(index, list, update)
                : null
        );
    }

    onSetState(index, update) {
        if (!_.isObject(update)) {
            this.onChange(index, update);
            return;
        }
        const item = _.assign(
            {},
            this.props.list[index],
            update
        );
        this.onChange(index, item);
    }

    onDelete(index) {
        const { list, setState, onDelete } = this.props;
        const update = _.concat(
            _.slice(list, 0, index),
            _.slice(list, index+1)
        );
        setState(
            update,
            onDelete
                ? () => onDelete(index, oldItem)
                : null
        );
    }

    onAdd() {
        const {
            list, initialItem = {}, setState, onAdd,
        } = this.props;

        const item = _.cloneDeep(initialItem);
        const update = _.concat(
            [],
            list,
            [item]
        );
        setState(
            update,
            onAdd
                ? () => onAdd(list.length, item)
                : null
        );
    }

    renderNewItemButton() {
        const {
            list, disabled = false, newItem = 'button',
        } = this.props;

        if (disabled) {
            return null;
        }

        if (newItem == 'auto') {
            return null;
        }
        if (newItem == 'initial' && !list.length) {
            return null;
        }

        return <li key="add-button">
            <ButtonField
                className="list-component__add"
                name="add"
                color="primary"
                icon="plus"
                label="&#8203;"
                onClick={() => this.onAdd()}
                />
        </li>;
    }

    render() {
        const {
            list, component: Component, componentProps = {},
            initialItem = {}, disabled = false, newItem = 'button',
        } = this.props;

        let items = _.map(
            list,
            (item, index) => ({item, index, disabled})
        );
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

        return <ul
            className={utils.makeStyle(
                {disabled},
                ["list-component"]
            )}
        >
            {_.map(items, ({item, index, disabled}) => (
            <li key={index}>
                <Component
                    {...item}
                    onChange={(item) => this.onChange(index, item)}
                    setState={(item) => this.onSetState(index, item)}
                    {...componentProps}
                    />
                {!disabled && (
                    <ButtonField
                        className="list-component__delete"
                        name="del"
                        color="warning"
                        icon="minus"
                        label="&#8203;"
                        onClick={() => this.onDelete(index)}
                    />
                )}
            </li>
            ))}
            {this.renderNewItemButton()}
        </ul>;
    }
};

ListComponent.defaultProps = {
    setState: (value) => {
        console.log(['ListComponent', value]);
    }
};

ListComponent.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
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

export default ListComponent;
