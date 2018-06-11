import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
    TagsContainer,
    Tag,
    TagBadge,
} from './BaseTagContainer.jsx';
import LazyComponent from './LazyComponent.jsx';
import SingleSelect from './SingleSelect.jsx';

export class TagContainer extends LazyComponent
{
    onDelete(tag, index) {
        const { value, onDelete, setState } = this.props;

        setState(
            _.concat(
                _.slice(value, 0, index),
                _.slice(value, index + 1)
            )
        );

        if (onDelete) {
            onDelete(tag, index);
        }
    }

    onAdd(newValue) {
        const { value, onAdd, setState } = this.props;

        setState(
            _.concat(value, [newValue])
        );

        if (onAdd) {
            onAdd(newValue);
        }
    }

    renderSelect() {
        const {
            value, items = [], disabled, multiple, showSelect = true,
        } = this.props;

        if (disabled) return null;
        if (!showSelect) return null;
        if (!items.length) return null;

        const filtered = _.chain(items)
            .filter(item => (
                multiple
                || !_.includes(value,  _.get(item, 'code', item.name))
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

    render() {
        const {
            value, items = [], disabled, multiple, showSelect = true,
           className,
        } = this.props;
        const counts = _.countBy(value);

        const tags = _.map(counts, (count, key) => {
            const { label, description } = (
                _.find(items, { code: key })
                || _.find(items, { name: key })
                || {}
            );

            return {
                key,
                count,
                label,
                description,
                disabled,
                onDelete: () => this.onDelete(
                    key,
                    _.indexOf(value, key)
                ),
            };
        });

        return <TagsContainer className={className}>
            {this.renderSelect()}

            {_.map(tags, tag => (
                <Tag {...tag}>
                    {multiple && tag.count > 1 &&
                        <TagBadge>
                            &times;&nbsp;{ tag.count }
                        </TagBadge>
                    }
                </Tag>
            ))}
        </TagsContainer>
    }
};

TagContainer.propTypes = {
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    setState: PropTypes.func.isRequired,
    className: PropTypes.string,
    showSelect: PropTypes.bool,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    items: PropTypes.arrayOf(
        PropTypes.object
    ),
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
};

export default TagContainer;
