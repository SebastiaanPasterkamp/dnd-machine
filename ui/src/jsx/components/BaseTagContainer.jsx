import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import utils from '../utils.jsx';

import '../../sass/_base-tag-container.scss';

import LazyComponent from './LazyComponent.jsx';
import SingleSelect from '../components/SingleSelect.jsx';

export class BaseTagContainer extends LazyComponent
{
    isDisabled(item) {
        const { isDisabled } = this.props;
        if (_.isFunction(isDisabled)) {
            return isDisabled(item);
        }
        return false;
    }

    isSelectable(item) {
        const { isSelectable } = this.props;
        if (_.isFunction(isSelectable)) {
            return isSelectable(item);
        }
        return !(item.hidden || false);
    }

    isImmutable(item) {
        const { disabled, isImmutable } = this.props;
        if (disabled) {
            return true;
        }
        if (_.isFunction(isImmutable)) {
            return isImmutable(item);
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
        const { disabled, showSelect } = this.props;
        return !disabled && showSelect;
    }

    getSelectOptions() {
        const { tagOptions } = this.props;
        return _.reject(
            tagOptions,
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
        const style = utils.makeStyle({
            'muted': this.isImmutable(item)
        }, ["nice-tag", item.color]);

        return <div key={key} className={style}>
            <span className="nice-tag-label">
                {item.label || item.name}
            </span>
            {_.map(this.getBadges(key, value, item), badge => (
                <span key={badge.key} className="nice-tag-badge">
                    {badge.label}
                    {badge.content}
                </span>
            ))}
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
        const style = utils.makeStyle({}, [
            "base-tag-container",
            "nice-tags-container",
            this.style
        ]);

        return <div className={style}>
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
            {_.map(this.getTags(), (value, key) => (
                this.renderTag(key, value)
            ))}
        </div>
    }
}

BaseTagContainer.defaultProps = {
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
    disabled: PropTypes.bool,
    isDisabled: PropTypes.func,
    isImmutable: PropTypes.func,
    isSelectable: PropTypes.func,
};

export default BaseTagContainer;
