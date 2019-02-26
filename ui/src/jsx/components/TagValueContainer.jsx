import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import utils from '../utils.jsx';

import '../../sass/_tag-value-container.scss';

import {
    TagsContainer,
    Tag,
    TagBadge,
} from './BaseTagContainer.jsx';
import LazyComponent from './LazyComponent.jsx';
import SingleSelect from '../components/SingleSelect.jsx';

export class TagValueContainer extends LazyComponent
{
    constructor(props) {
        super(props);
        this.funcCache = {};
    }

    memoize = (key, func) => {
        if (!(key in this.funcCache)) {
            this.funcCache[key] = func;
        }
        return this.funcCache[key];
    }

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

    renderSelect() {
        const {
            value, items = [], disabled, showSelect = true,
        } = this.props;

        if (disabled) return null;
        if (!showSelect) return null;
        if (!items.length) return null;

        const filtered = _.chain(items)
            .filter(item => !(
                _.get(item, 'code', item.name) in value
            ))
            .map(item => _.pickBy(
                {
                    code: _.get(item, 'code', item.name),
                    label: _.get(item, 'label', item.name),
                    description: item.description,
                },
                v => v !== undefined
            ))
            .value();

        if (!filtered.length) return null;

        return <SingleSelect
            emptyLabel="Add..."
            items={filtered}
            setState={item => this.onAdd(item)}
            />;
    }

    renderBadge(badgeItems, tag) {
        const { disabled = false, } = this.props;
        const label = _.get(
            _.find(badgeItems || {}, {key: tag.value}),
            'label',
            tag.value
        );

        if (disabled) {
            return <TagBadge>
                { label }
            </TagBadge>;
        }

        if (!badgeItems) {
            return <TagBadge>
                <input
                    type="number"
                    value={tag.value}
                    disabled={disabled}
                    onChange={e => this.onChange(
                        tag.key,
                        e.target.value
                    )}
                    />
            </TagBadge>;
        }

        return <TagBadge>
            { label }
            <div className="nice-tag-dropdown hover">
                <ul>
                {_.map(badgeItems, option => (
                    <li
                        key={option.key}
                        data-value={option.key}
                        onClick={this.memoize(
                            `onClick-${tag.key}`,
                            () => this.onChange(tag.key, option.key)
                        )}
                        >
                        <a className="cursor-pointer">
                            { option.label }
                        </a>
                    </li>
                ))}
                </ul>
            </div>
        </TagBadge>;
    }

    render() {
        const {
            value, tagValues, items = [], setState, className,
            disabled,
        } = this.props;
        const style = utils.makeStyle({}, [
            "tag-value-container",
            className,
        ]);

        const badgeItems = tagValues
            ? _.map(tagValues, item => ({
                key: _.get(item, 'code', item.name),
                label: _.get(item, 'label', item.name),
            }))
            : null;

        const tags = _.map(value, (value, key) => {
            const { label, description } = (
                _.find(items, { code: key })
                || _.find(items, { name: key })
                || {}
            );

            return {
                key,
                value,
                label,
                description,
                disabled,
                onChange: this.memoize(
                    `onChange-${key}`,
                    (value) => this.onChange(key, value)
                ),
                onDelete: this.memoize(
                    `onDelete-${key}`,
                    () => this.onDelete(key)
                ),
            };
        });

        return <TagsContainer className={ style }>
            {this.renderSelect()}

            {_.map(tags, tag => (
                <Tag {...tag}>
                    {this.renderBadge(badgeItems, tag)}
                </Tag>
            ))}
        </TagsContainer>;
    }
}

TagValueContainer.propTypes = {
    value: PropTypes.object.isRequired,
    tagValues: PropTypes.arrayOf(
        PropTypes.object
    ),
    className: PropTypes.string,
    showSelect: PropTypes.bool,
    disabled: PropTypes.bool,
    items: PropTypes.arrayOf(
        PropTypes.object
    ),
    onAdd: PropTypes.func,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
};

export default TagValueContainer;
