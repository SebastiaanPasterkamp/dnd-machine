import React from 'react';
import PropTypes from 'prop-types';
import {
    countBy,
    find,
    findIndex,
    indexOf,
    keys,
    map,
    uniqBy,
} from 'lodash/fp';

import { memoize } from '../../utils';

import {
    BaseTagContainer,
    Tag,
    TagBadge,
    TagButton,
} from '../BaseTagContainer';
import SingleSelect from '../SingleSelect';

import TagSelect from './components/TagSelect';

export class TagContainer extends React.Component
{
    constructor(props) {
        super(props);
        this.onNew = this.onNew.bind(this);
        this.memoize = memoize.bind(this);
    }

    onNew(item) {
        const { value, onAdd, multiple, objects, setState } = this.props;
        const { type, id, name } = objects ? item : { id: item };
        const index = objects
            ? findIndex({ type, id }, value)
            : indexOf(item, value);

        if (!multiple && index >= 0) {
            return;
        }

        if (onAdd) {
            onAdd(item);
        }

        if (!objects) {
            setState([
                ...value,
                item,
            ]);
            return;
        }

        if (index >= 0 && multiple) {
            setState([
                ...value.slice(0, index),
                {...value[index], count: (value[index].count || 1) + 1},
                ...value.slice(index + 1),
            ]);
            return;
        }

        if (multiple) {
            setState([
                ...value,
                { type, id, name, count: 1},
            ]);
        } else {
            setState([
                ...value,
                { type, id, name },
            ]);
        }
    }

    onAdd(item) {
        const key = this.getKey('add', item);

        return this.memoize(key, () => this.onNew(item));
    }

    onDelete(item) {
        const key = this.getKey('delete', item);

        return this.memoize(key, () => {
            const { value, onDelete, multiple, objects, setState } = this.props;
            const { type, id, name } = objects ? item : { id: item };
            const index = objects
                ? findIndex({ type, id }, value)
                : indexOf(item, value);

            if (index < 0) {
                return;
            }

            if (onDelete) {
                onDelete(item, index);
            }

            if (multiple && objects && (value[index].count || 1) > 1) {
                setState([
                    ...value.slice(0, index),
                    {...value[index], count: value[index].count - 1},
                    ...value.slice(index + 1),
                ]);
                return;
            }

            setState([
                ...value.slice(0, index),
                ...value.slice(index + 1),
            ]);
        });
    }

    getKey(action, item) {
        const { objects } = this.props;
        return objects ? `${action}-${item.type}.${item.id}` : item;
    }

    render() {
        const {
            value,
            items,
            disabled: propDisabled,
            multiple,
            filterable,
            objects,
            showSelect,
           className,
        } = this.props;
        const counts = countBy(item => this.getKey('count', item))(value);

        const tags = uniqBy('key', map(
            item => {
                const key = this.getKey('count', item);
                const {
                    id = item,
                    count = counts[key],
                    type, name, description, disabled,
                } = objects ? item : (
                    find({ id: item }, items)
                    || find({ name: item }, items)
                    || {}
                );

                return {
                    key,
                    type,
                    id,
                    count,
                    name,
                    description,
                    disabled: propDisabled || disabled,
                    onDelete: this.onDelete(item),
                };
            }
        )(value));

        return (
            <BaseTagContainer className={className}>
                {!propDisabled && showSelect ? (
                    <TagSelect
                        onSelect={this.onNew}
                        items={items}
                        current={value}
                        objects={objects}
                        multiple={multiple}
                        filterable={filterable}
                    />
                ) : null}

                {map(
                    tag => (
                        <Tag {...tag}>
                            {multiple ? ([
                                <TagButton
                                    key="plus"
                                    icon="fa-plus"
                                    onClick={this.onAdd(tag)}
                                >
                                    &nbsp;
                                </TagButton>,
                                <TagBadge key="count">
                                    &times;&nbsp;{ tag.count }
                                </TagBadge>
                            ]) : null}
                        </Tag>
                    )
                )(tags)}
            </BaseTagContainer>
        );
    }
};

TagContainer.propTypes = {
    value: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.shape({
                type: PropTypes.string,
                id: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number,
                    PropTypes.bool,
                ]).isRequired,
                name: PropTypes.string.isRequired,
            }),
        ])
    ).isRequired,
    setState: PropTypes.func,
    className: PropTypes.string,
    showSelect: PropTypes.bool,
    multiple: PropTypes.bool,
    filterable: PropTypes.bool,
    objects: PropTypes.bool,
    disabled: PropTypes.bool,
    items: PropTypes.arrayOf(
        PropTypes.object
    ),
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
};

TagContainer.defaultProps = {
    value: [],
    setState: null,
    className: null,
    showSelect: true,
    multiple: false,
    filterable: false,
    objects: false,
    disabled: false,
    items: [],
    onAdd: null,
    onDelete: null,
};

export default TagContainer;
