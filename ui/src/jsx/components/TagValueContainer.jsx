import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_list-component.scss';

import BaseTagContainer from './BaseTagContainer.jsx';

export class TagValueContainer extends BaseTagContainer
{
    onChange(key, value) {
        const state = _.pickBy(
            _.assign(
                {},
                this.props.tags,
                {[key]: value}
            ),
            (value) => {
                return value !== undefined;
            }
        );
        this.props.setState(state);
    }

    onDelete(key, value) {
        this.onChange(key, undefined);
    }

    onAdd(value) {
        const item = this.props.tagValues[0];
        this.onChange(
            value,
            this.props.defaultValue || item.code || item.name
        );
    }

    getItem(key, value) {
        return _.find(this.props.tagOptions, {code: key})
            || _.find(this.props.tagOptions, {name: key})
    }

    isDisabled(item) {
        if ('isDisabled' in this.props) {
            return this.props.isDisabled(item);
        }
        if (this.props.multiple || false) {
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
        return [
            {
                key: 'values',
                label: value,
                content: <div className="nice-tag-dropdown hover">
                    <ul>
                        {_.map(this.props.tagValues, (option) => {
                            return <li key={option.code || option.name}>
                                <a onClick={() => this.onChange(
                                    key, option.label
                                    )}>
                                    {option.label}
                                </a>
                            </li>;
                        })}
                    </ul>
                </div>
            }
        ];
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
