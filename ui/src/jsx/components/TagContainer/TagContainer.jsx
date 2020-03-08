import React from 'react';
import PropTypes from 'prop-types';
import {
    countBy,
    find,
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
} from '../BaseTagContainer';
import SingleSelect from '../SingleSelect';

import TagSelect from './components/TagSelect';

export class TagContainer extends React.Component
{
    constructor(props) {
        super(props);
        this.onAdd = this.onAdd.bind(this);
        this.memoize = memoize.bind(this);
    }

    onAdd(item) {
        const { value, onAdd, multiple, objects, setState } = this.props;
        const { type, id, name } = objects ? item : { id: item };
        const needle = objects ? { type, id } : item;
        const index = indexOf(needle, value);

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
            return;
        }

        setState([
            ...value,
            { type, id, name },
        ]);
    }

    onDelete(item) {
        const key = this.getKey(item);

        return this.memoize(key, () => {
            const { value, onDelete, multiple, objects, setState } = this.props;
            const { type, id, name } = objects ? item : { id: item };
            const needle = objects ? { type, id } : item;
            const index = indexOf(needle, value);

            if (onDelete) {
                onDelete(item, index);
            }

            if (multiple && objects && value[index].count > 0) {
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

    getKey(item) {
        const { objects } = this.props;
        return objects ? `${item.type}.${item.id}` : item;
    }

    render() {
        const {
            value,
            items,
            disabled: propDisabled,
            multiple,
            objects,
            showSelect,
           className,
        } = this.props;
        const counts = countBy(item => this.getKey(item))(value);

        const tags = uniqBy('key', map(
            item => {
                const key = this.getKey(item);
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
                        onSelect={this.onAdd}
                        items={items}
                        current={value}
                        objects={objects}
                        multiple={multiple}
                    />
                ) : null}

                {map(
                    tag => (
                        <Tag {...tag}>
                            {multiple ? (
                                <TagBadge>
                                    &times;&nbsp;{ tag.count }
                                </TagBadge>
                            ) : null}
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
    objects: false,
    disabled: false,
    items: [],
    onAdd: null,
    onDelete: null,
};

export default TagContainer;
