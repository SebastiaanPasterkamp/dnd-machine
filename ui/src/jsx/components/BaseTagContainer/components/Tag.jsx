import React from 'react';
import PropTypes from 'prop-types';
import {
    entries,
    flow,
    map,
} from 'lodash/fp';

import utils from '../../../utils';

import ToolTip from '../../ToolTip';

import {
    TagBadge,
    TagButton,
    TagLabel,
} from '..';

export const Tag = function({
    name, label, description, className, color, badges,
    children, onChange, disabled, onDelete,
}) {
    const style = utils.makeStyle(
        {
            [color]: color,
            'muted': !color && disabled && onDelete,
        },
        ["nice-tag", className]
    );

    return (
        <div className={style}>
            <TagLabel>
                 <ToolTip content={description}>
                    {label || name}
                </ToolTip>
            </TagLabel>
            {children}
            {flow(entries, map(
                ([index, badge]) => {
                    const {
                        component: Component,
                        ...props
                    } = badge;
                    return (
                        <TagBadge key={index}>
                            {Component ? (
                                <Component
                                    disabled={disabled}
                                    {...props}
                                    onChange={onChange}
                                />
                            ) : null}
                        </TagBadge>
                    );
                }
            ))(badges)}
            {!disabled && onDelete ? (
                <TagButton
                    icon="fa-trash-o"
                    onClick={onDelete}
                />
            ) : null}
        </div>
    );
};

Tag.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    description: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    color: PropTypes.string,
    onDelete: PropTypes.func,
    onChange: PropTypes.func,
    badges: PropTypes.arrayOf(
        PropTypes.shape({
            component: PropTypes.any,
        })
    ),
};

Tag.defaultProps = {
    name: null,
    label: null,
    description: null,
    disabled: false,
    className: null,
    color: null,
    onDelete: null,
    onChange: null,
    badges: [],
};

export default Tag;
