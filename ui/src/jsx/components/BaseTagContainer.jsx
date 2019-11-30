import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import utils from '../utils';

import '../../sass/_base-tag-container.scss';

import LazyComponent from './LazyComponent';
import SingleSelect from '../components/SingleSelect';
import ToolTip from '../components/ToolTip';

export class TagBadge extends LazyComponent
{
    render() {
        const { children, icon} = this.props;

        return <span
            className="nice-tag-badge"
            >
            {icon && <i className={`icon $(icon)`} />}
            {children}
        </span>;
    }
}

TagBadge.propTypes = {
    children: PropTypes.node,
    icon: PropTypes.string,
};

export class TagBadgeButton extends LazyComponent
{
    render() {
        const { onClick, icon, label } = this.props;

        return <button
            className="nice-tag-btn"
            onClick={onClick}
            >
            {icon && <i className={`icon ${icon}`} />}
            {label}
        </button>;
    }
}

TagBadgeButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

export class Tag extends LazyComponent
{
    render() {
        const {
            label, description, className, color, badges = [],
            children, onChange, disabled, onDelete,
        } = this.props;

        const style = utils.makeStyle({
            'muted': !color && (disabled || !onDelete),
        }, ["nice-tag", color, className]);

        return <div className={style}>
            <span className="nice-tag-label">
                 <ToolTip content={description}>
                    {label}
                </ToolTip>
            </span>
            {children}
            {_.map(
                badges,
                (badge, index) => {
                    const {
                        component: Comp, ...props
                    } = badge;
                    return <span
                        key={index}
                        className="nice-tag-badge"
                        >
                        {Comp
                            ? <Comp
                                disabled={(disabled || !onDelete)}
                                {...props}
                                onChange={value => onChange(value)}
                                />
                            : null
                        }
                    </span>;
                }
            )}
            {!disabled && onDelete &&
                <TagBadgeButton
                    onClick={() => onDelete()}
                    icon="fa-trash-o"
                    />
            }
        </div>;
    }
};

Tag.propTypes = {
    label: PropTypes.oneOfType([
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
            value: PropTypes.any,
            Component: PropTypes.any,
        })
    ),
};

export class TagsContainer extends LazyComponent
{
    render() {
        const { className, children } = this.props;

        const style = utils.makeStyle({}, [
            "base-tag-container",
            "nice-tags-container",
            className
        ]);

        return <div className={style}>
            {children}
        </div>;
    }
}

TagsContainer.propTypes = {
    className: PropTypes.string,
};

export default TagsContainer;
