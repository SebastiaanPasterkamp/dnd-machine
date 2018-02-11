import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_base-tag-container.scss';

import LazyComponent from './LazyComponent.jsx';
import SingleSelect from '../components/SingleSelect.jsx';

export class BaseTagContainer extends LazyComponent
{
    isDisabled(item) {
        if ('isDisabled' in this.props) {
            return this.props.isDisabled(item);
        }
        return false;
    }

    isSelectable(item) {
        if ('isSelectable' in this.props) {
            return this.props.isSelectable(item);
        }
        return !(item.hidden || false);
    }

    isImmutable(item) {
        if ('isImmutable' in this.props) {
            return this.props.isImmutable(item);
        }
        return item.immutable || false;
    }

    getTags() {
        return this.props.tags;
    }

    getBadges(key, value, item) {
        return [];
    }

    showSelect() {
        return this.props.showSelect;
    }

    getSelectOptions() {
        return _.reject(
            this.props.tagOptions,
            (item) => !this.isSelectable(item)
        );
    }

    renderDeleteButton(key, value, item) {
        if (this.isImmutable(item)) {
            return null;
        }

        return <button
                className="nice-tag-btn"
                onClick={() => this.onDelete(key, value)}
                >
            <i className="icon fa-trash-o"></i>
        </button>;
    }

    renderTag(key, value) {
        const item = this.getItem(key, value)
            || {label: value, color: 'bad'};
        var style = ["nice-tag"];
        if (item.color) {
            style.push(item.color);
        } else if (this.isImmutable(item)) {
            style.push('muted');
        }

        return <div key={key} className={style.join(' ')}>
            <span className="nice-tag-label">
                {item.label || item.name}
            </span>
            {_.map(this.getBadges(key, value, item), (badge) => {
                return <span key={badge.key} className="nice-tag-badge">
                    {badge.label}
                    {badge.content}
                </span>
            })}
            {item.description
                ? <span className="nice-tag-badge">
                    ?
                    <div className="nice-tag-dropdown hover">
                        <ul>
                            {item.description}
                        </ul>
                    </div>
                </span>
                : null
            }
            {this.renderDeleteButton(key, value, item)}
        </div>;
    }

    render() {
        return <div className="nice-tags-container">
            {this.showSelect()
                ? <SingleSelect
                    emptyLabel="Add..."
                    items={this.getSelectOptions()}
                    setState={
                        (value) => this.onAdd(value)
                    }
                    isDisabled={(item) => this.isDisabled(item)}
                    />
                : null
            }
            {_.map(this.getTags(), (value, key) => {
                return this.renderTag(key, value);
            })}
        </div>
    }
}

BaseTagContainer.defaultProps = {
    multiple: false,
    showSelect: true,
    setState: (value) => {
        console.log(['BaseTagContainer', value]);
    }
};

BaseTagContainer.propTypes = {
    setState: PropTypes.func.isRequired,
    tagOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    showSelect: PropTypes.bool,
    multiple: PropTypes.bool,
    isDisabled: PropTypes.func,
    isImmutable: PropTypes.func,
    isSelectable: PropTypes.func,
};

export default BaseTagContainer;
