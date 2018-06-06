import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import utils from '../utils.jsx';

import '../../sass/_base-tag-container.scss';

import LazyComponent from './LazyComponent.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import ToolTip from '../components/ToolTip.jsx';

export class BaseTag extends LazyComponent
{
    render() {
        const {
            id, label, description, className, color, badges = [],
            onChange, disabled, onDelete,
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
            {(disabled || !onDelete)
                ? null
                : <button
                        className="nice-tag-btn"
                        onClick={() => onDelete()}
                        >
                    <i className="icon fa-trash-o"></i>
                </button>
            }
        </div>;
    }
};

BaseTag.propTypes = {
    label: PropTypes.string,
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

export class BaseTagContainer extends LazyComponent
{
    render() {
        const {
            value, className, showSelect = true, items = [],
            onAdd, onChange, onDelete, disabled,
        } = this.props;

        const style = utils.makeStyle({}, [
            "base-tag-container",
            "nice-tags-container",
            className
        ]);

        return <div className={style}>
            {showSelect && items.length
                ? <SingleSelect
                    emptyLabel="Add..."
                    items={items}
                    setState={ disabled
                        ? null
                        : item => onAdd(item)
                    }
                    disabled={disabled}
                    />
                : null
            }
            {_.map(value, (tag, index) => (
                <BaseTag
                    key={index}
                    onDelete={() => onDelete(tag.id, index)}
                    onChange={disabled
                        ? null
                        : value => onChange(tag.id, value)
                    }
                    disabled={disabled}
                    {...tag}
                    />
            ))}
        </div>;
    }
}

BaseTagContainer.propTypes = {
    value: PropTypes.array.isRequired,
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

export default BaseTagContainer;
