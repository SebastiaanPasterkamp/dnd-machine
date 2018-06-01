import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_tag-value-container.scss';

import BaseTagContainer from './BaseTagContainer.jsx';
import LazyComponent from './LazyComponent.jsx';

class TagValueDropdown extends LazyComponent
{
    render() {
        const {
            items, value, onChange, disabled = false,
        } = this.props;

        if (items === undefined) {
            return <input
                type="number"
                value={value}
                disabled={disabled}
                onChange={e => onChange(e.target.value)}
                />;
        }

        const { label } = (
            _.find(items, { code: value })
            || _.find(items, { name: value })
            || { label: value }
        );

        return <div className="nice-tag-dropdown hover">
            {label}
            <ul>
            {_.map(items, item => {
                const value = _.get(item, 'code', item.name);
                return <li
                    key={value}
                    data-value={value}
                    >
                    <a onClick={() => onChange(value)}>
                        {item.label}
                    </a>
                </li>;
            })}
            </ul>
        </div>;
    }
};

export class TagValueContainer extends LazyComponent
{
    onChange(key, newValue) {
        const { value, onChange, setState } = this.props;
        setState(
            _.pickBy(
                _.assign(
                    {},
                    value,
                    {[key]: newValue}
                ),
                value => (value !== undefined)
            )
        );

        if (onChange) {
            onChange(key, newValue);
        }
    }

    onDelete(key) {
        const { value, onDelete, setState } = this.props;
        setState(
            _.pickBy(
                _.assign(
                    {},
                    value,
                    {[key]: undefined}
                ),
                value => (value !== undefined)
            )
        );

        if (onDelete) {
            onDelete(key);
        }
    }

    onAdd(key) {
        const {
            value, defaultValue = 0, onAdd, setState,
        } = this.props;
        setState(
            _.pickBy(
                _.assign(
                    {},
                    value,
                    {[key]: defaultValue}
                ),
                value => (value !== undefined)
            )
        );

        if (onAdd) {
            onAdd(key, defaultValue);
        }
    }

    getItems() {
        const { items = [], value } = this.props;
        const filtered = _.filter(items, item => !(
            _.get(item, 'code', item.name) in value
        ));

        return _.map(
            filtered,
            item => _.pickBy({
                id: _.get(item, 'code', item.name),
                code: item.code,
                name: item.name,
                label: item.label,
                description: item.description,
            }, v => (v !== undefined))
        );
    }

    getItem(tag, value) {
        const {
            items = [], tagValues, onChange, disabled,
        } = this.props;
        const { code, name, label, description } = (
            _.find(items, { code: tag })
            || _.find(items, { name: tag })
            || {}
        );

        return _.pickBy({
            id: tag,
            code,
            name,
            label,
            description,
            badges: [{
                component: TagValueDropdown,
                onChange: onChange,
                items: tagValues,
                value,
                disabled,
            }]
        }, v => (v !== undefined));
    }

    render() {
        const {
            value, setState, ...props,
        } = this.props;

        return <BaseTagContainer
            {...props}
            className="tag-value-container"
            items={this.getItems()}
            onAdd={(item) => this.onAdd(item)}
            onChange={(tag, index, badge, value) => this.onChange(
                tag, index, badge, value
            )}
            onDelete={(tag, index) => this.onDelete(tag, index)}
            value={_.map(
                value,
                (value, tag) => this.getItem(tag, value)
            )}
            />;
    }
}

TagValueContainer.propTypes = _.assign(
    {}, BaseTagContainer.propTypes, {
        value: PropTypes.object.isRequired,
        tagValues: PropTypes.arrayOf(
            PropTypes.object
        ),
        setState: PropTypes.func.isRequired,
        onAdd: PropTypes.func,
        onChange: PropTypes.func,
        onDelete: PropTypes.func,
    }
);

export default TagValueContainer;
