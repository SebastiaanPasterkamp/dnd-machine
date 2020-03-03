import React from 'react';
import PropTypes from 'prop-types';
import {
    find,
    keys,
    map,
} from 'lodash/fp';

import utils, { memoize } from '../../utils';

import './sass/_tag-value-container.scss';

import {
    BaseTagContainer,
    Tag,
    TagBadge,
} from '../BaseTagContainer';
import SingleSelect from '../SingleSelect';

import TagSelect from './components/TagSelect';

export class TagValueContainer extends React.Component
{
    constructor(props) {
        super(props);
        this.memoize = memoize.bind(this);
        this.onAdd = this.onAdd.bind(this);
    }

    onAdd(key) {
        const { value, defaultValue, onAdd, setState } = this.props;

        setState({
            ...value,
            [key]: defaultValue,
        });

        if (onAdd) {
            onAdd(key, defaultValue);
        }
    }

    onChange(key) {
        return this.memoize(
            `onChange-${key}`,
            e => {
                const { value, onChange, setState } = this.props;
                setState({
                    ...value,
                    [key]: e.target.value,
                });

                if (onChange) {
                    onChange(key, e.target.value);
                }
            }
        );
    }

    onDelete(key) {
        return this.memoize(
            `onDelete-${key}`,
            () => {
                const {
                    value: {
                        [key]: removed,
                        ...remaining,
                    },
                    onDelete,
                    setState,
                } = this.props;
                setState(remaining);

                if (onDelete) {
                    onDelete(key);
                }
            }
        );
    }

    render() {
        const { value, items, className, disabled, showSelect } = this.props;
        const style = utils.makeStyle({}, [
            "tag-value-container",
            className,
        ]);

        return (
            <BaseTagContainer className={ style }>
                {!disabled && showSelect ? (
                    <TagSelect
                        onSelect={this.onAdd}
                        items={items}
                        current={value}
                    />
                ) : null}

                {map(key => {
                    const { name, description } = (
                        find({ id: key }, items)
                        || find({ name: key }, items)
                        || {}
                    );

                    return (
                        <Tag
                            key={key}
                            label={name}
                            description={description}
                            onDelete={this.onDelete(key)}
                            disabled={disabled}
                        >
                            <TagBadge>
                                {disabled ? (
                                    value[key]
                                ) : (
                                    <input
                                        type="number"
                                        value={value[key] || ''}
                                        onChange={this.onChange(key)}
                                    />
                                )}
                            </TagBadge>
                        </Tag>
                    );
                })(keys(value))}
            </BaseTagContainer>
        );
    }
}

TagValueContainer.propTypes = {
    value: PropTypes.objectOf(
        PropTypes.number
    ).isRequired,
    defaultValue: PropTypes.number,
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

TagValueContainer.defaultProps = {
    defaultValue: 0,
    className: null,
    showSelect: true,
    disabled: false,
    items: [],
    onAdd: null,
    onChange: null,
    onDelete: null,
};

export default TagValueContainer;
