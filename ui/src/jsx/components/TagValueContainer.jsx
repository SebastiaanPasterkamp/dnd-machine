import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_tag-value-container.scss';

import BaseTagContainer from './BaseTagContainer.jsx';

export class TagValueContainer extends BaseTagContainer
{
    constructor(props) {
        super(props);
        this.style = "tag-value-container";
    }

    onChange(key, value) {
        const { tags, setState } = this.props;
        const state = _.pickBy(
            _.assign(
                {},
                tags,
                {[key]: value}
            ),
            (value) => (value !== undefined)
        );
        setState(state);
    }

    onDelete(key, value) {
        this.onChange(key, undefined);
    }

    onAdd(key) {
        const { tagValues, defaultValue } = this.props;
        const item = tagValues ? tagValues[0] : {};
        this.onChange(
            key,
            defaultValue || item.code || item.name || 0
        );
    }

    getItem(key, value) {
        const { tagOptions } = this.props;
        return _.find(tagOptions, {code: key})
            || _.find(tagOptions, {name: key})
    }

    isDisabled(item) {
        const { isDisabled, multiple } = this.props;
        if (_.isFunction(isDisabled)) {
            return isDisabled(item);
        }
        if (multiple) {
            return false;
        }
        const tags = this.getTags();
        const tag = (item.code || item.name)
        if (tag in tags) {
            return true;
        }
        return false;
    }

    getBadges(key, value, item) {
        const { tagValues, disabled } = this.props;

        if (tagValues) {
            return [{
                key: 'values',
                label: value,
                content: disabled ? null : <div className="nice-tag-dropdown hover">
                    <ul>
                    {_.map(tagValues, option => (
                        <li key={option.code || option.name}>
                            <a onClick={() => this.onChange(
                                key, option.label
                                )}>
                                {option.label}
                            </a>
                        </li>
                    ))}
                    </ul>
                </div>
            }]
        }

        return [{
            key: 'values',
            label: <input
                value={value || ''}
                disabled={disabled}
                type="number"
                onChange={(e) => this.onChange(
                    key, parseInt(e.target.value || 0)
                )}
                />
        }];
    }
}

TagValueContainer.defaultProps = _.assign({}, BaseTagContainer.defaultProps, {
    setState: (value) => {
        console.log(['TagValueContainer', value]);
    }
});

TagValueContainer.propTypes = _.assign({}, BaseTagContainer.propTypes, {
    tags: PropTypes.object.isRequired,
    onAdd: PropTypes.func,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
});

export default TagValueContainer;
