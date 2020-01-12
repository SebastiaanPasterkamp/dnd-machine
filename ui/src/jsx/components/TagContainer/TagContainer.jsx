import React from 'react';
import PropTypes from 'prop-types';
import {
    countBy,
    find,
    keys,
    map,
} from 'lodash/fp';

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
    }

    onAdd(newValue) {
        const { value, onAdd, setState } = this.props;

        setState([
            ...value,
            newValue,
        ]);

        if (onAdd) {
            onAdd(newValue);
        }
    }

    onDelete(tag, index) {
        const { value, onDelete, setState } = this.props;

        setState([
            ...value.slice(0, index),
            ...value.slice(index + 1),
        ]);

        if (onDelete) {
            onDelete(tag, index);
        }
    }

    render() {
        const {
            value,
            items,
            disabled: propDisabled,
            multiple,
            showSelect,
           className,
        } = this.props;
        const counts = countBy(null, value);

        const tags = map(
            key => {
                const { name, label, description, disabled } = (
                    find({ id: key }, items)
                    || find({ code: key }, items)
                    || find({ name: key }, items)
                    || {}
                );

                return {
                    key,
                    count: counts[key],
                    label: name !== undefined ? name : label,
                    description,
                    disabled: propDisabled || disabled,
                    onDelete: this.onDelete.bind(this, key, value.indexOf(key)),
                };
            }
        )(keys(counts));

        return (
            <BaseTagContainer className={className}>
                {!propDisabled ? (
                    <TagSelect
                        onSelect={this.onAdd}
                        items={items}
                        current={value}
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
        ])
    ).isRequired,
    setState: PropTypes.func,
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

TagContainer.defaultProps = {
    value: [],
    setState: null,
    className: null,
    showSelect: true,
    multiple: false,
    disabled: false,
    items: [],
    onAdd: null,
    onDelete: null,
};

export default TagContainer;
