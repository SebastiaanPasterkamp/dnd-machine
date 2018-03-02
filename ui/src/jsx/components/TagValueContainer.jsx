import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_list-component.scss';

import BaseTagContainer from './BaseTagContainer.jsx';

export class TagValueContainer extends BaseTagContainer
{
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

    onAdd(value) {
        const { tagValues, defaultValue } = this.props;
        const item = tagValues[0];
        this.onChange(
            value,
            defaultValue || item.code || item.name
        );
    }

    getItem(key, value) {
        const { tagOptions } = this.props;
        return _.find(tagOptions, {code: key})
            || _.find(tagOptions, {name: key})
    }

    isDisabled(item) {
        const { isDisabled, multiple } = this.props;
        if (isDisabled) {
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
        const { tagValues } = this.props;
        return [{
            key: 'values',
            label: value,
            content: <div className="nice-tag-dropdown hover">
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
