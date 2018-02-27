import React from 'react';
import _ from 'lodash';

import '../../sass/_list-component.scss';

import LazyComponent from './LazyComponent.jsx';
import ButtonField from './ButtonField.jsx';

export class ListComponent extends LazyComponent
{
    onChange(index, item) {
        const { list, setState, onChange } = this.props;
        const head = _.take(list, index),
            oldItem = list[index],
            tail = _.takeRight(list, list.length - index - 1);
        setState(
            head.concat([item]).concat(tail),
            onChange
                ? () => onChange(index, oldItem, item)
                : null
        );
    }

    onSetState(index, update) {
        const item = _.assign(
            {},
            this.props.list[index],
            update
        );
        this.onChange(index, item);
    }

    onDelete(index) {
        const { list, setState, onDelete } = this.props;
        const head = _.take(list, index),
            oldItem = list[index],
            tail = _.takeRight(list, list.length - index - 1);
        setState(
            head.concat(tail),
            onDelete
                ? () => onDelete(index, oldItem)
                : null
        );
    }

    onAdd(item={}) {
        const { list, setState, onAdd } = this.props;
        const head = _.take(list, list.length);
        setState(
            head.concat([item]),
            onAdd
                ? () => onAdd(onAdd(list.length, item))
                : null
        );
    }

    render() {
        const {
            list, keyProp, component: Component, componentProps = {},
            initialItem = {}
        } = this.props;

        return <ul className="list-component">
            {_.map(list, (item, index) => (
            <li key={index}>
                <Component
                    {...item}
                    onChange={(item) => this.onChange(index, item)}
                    setState={(item) => this.onSetState(index, item)}
                    {...componentProps}
                    />
                <ButtonField
                    className="list-component__delete"
                    name="del"
                    color="warning"
                    icon="minus"
                    label="&#8203;"
                    onClick={() => this.onDelete(index)}
                    />
            </li>
            ))}
            <li key="add-button">
                <ButtonField
                    className="list-component__add"
                    name="add"
                    color="primary"
                    icon="plus"
                    label="&#8203;"
                    onClick={() => this.onAdd(_.assign({}, initialItem))}
                    />
            </li>
        </ul>;
    }
}

ListComponent.defaultProps = {
    setState: (value) => {
        console.log(['ListComponent', value]);
    }
};

export default ListComponent;
