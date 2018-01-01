import React from 'react';
import _ from 'lodash';

import '../../sass/_list-component.scss';

import LazyComponent from './LazyComponent.jsx';
import ButtonField from './ButtonField.jsx';

export class ListComponent extends LazyComponent
{
    onChange(index, item) {
        let head = _.take(
                this.props.list, index),
            oldItem = this.props.list[index],
            tail = _.takeRight(
                this.props.list, this.props.list.length - index - 1);
        this.props.setState(
            head.concat([item]).concat(tail),
            () => {
                if (this.props.onChange) {
                    this.props.onChange(index, oldItem, item);
                }
            }
        );
    }

    onSetState(index, update) {
        let item = _.assign(
            {},
            this.props.list[index],
            update
        );
        this.onChange(index, item);
    }

    onDelete(index) {
        let head = _.take(
                this.props.list, index),
            oldItem = this.props.list[index],
            tail = _.takeRight(
                this.props.list, this.props.list.length - index - 1);
        this.props.setState(
            head.concat(tail),
            () => {
                if (this.props.onDelete) {
                    this.props.onDelete(index, oldItem);
                }
            }
        );
    }

    onAdd(item={}) {
        let head = _.take(
                this.props.list, this.props.list.length);
        if (this.props.onAdd) {
            this.props.onAdd(this.props.list.length, item);
        }
        this.props.setState(head.concat([item]));
    }

    render() {
        let onDelete = (index) => () => {
                this.onDelete(index);
            },
            onAdd = () => (e) => {
                this.onAdd();
            },
            onChange = (index) => (item) => {
                this.onChange(index, item);
            },
            onSetState = (index) => (update) => {
                this.onSetState(index, update);
            },
            componentProps = this.props.componentProps || {};

        return <ul className="list-component">
            {_.map(this.props.list, (item, index) => {
                const key = this.props.keyProp == null
                    ? index : (item[this.props.keyProp] || '_');
                return <li key={key}>
                    <this.props.component
                        {...item}
                        onChange={onChange(index)}
                        setState={onSetState(index)}
                        {...componentProps}
                        />
                    <ButtonField
                        className="list-component__delete"
                        name="del"
                        color="warning"
                        icon="minus"
                        label="&#8203;"
                        onClick={onDelete(index)}
                        />
                </li>
                })}
            <li key="add-button">
                <ButtonField
                    className="list-component__add"
                    name="add"
                    color="primary"
                    icon="plus"
                    label="&#8203;"
                    onClick={onAdd()}
                    />
            </li>
        </ul>
    }
}

ListComponent.defaultProps = {
    keyProp: null,
    setState: (value) => {
        console.log(['ListComponent', value]);
    }
};

export default ListComponent;
