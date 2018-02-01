import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_base-tag-container.scss';

import LazyComponent from './LazyComponent.jsx';
import SingleSelect from '../components/SingleSelect.jsx';

export class BaseTagContainer extends LazyComponent
{
    isDisabled(item) {
        if (this.props.multiple || false) {
            return false;
        }
        if (_.includes(this.getTags(), item.code || item.name)) {
            return true;
        }
        return false;
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
            'hidden'
        );
    }

    renderDeleteButton(key, value, item) {
        if (item.immutable || false) {
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
        } else if (item.immutable) {
            style.push('muted');
        }

        return <div key={key} className={style.join(' ')}>
            <span className="nice-tag-label">
                {item.label || item.name}
            </span>
            {_.map(this.getBadges(key, value, item), (badge) => {
                <span key={badge.key} className="nice-tag-badge">
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
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    showSelect: PropTypes.bool,
    multiple: PropTypes.bool,
};

export default BaseTagContainer;
