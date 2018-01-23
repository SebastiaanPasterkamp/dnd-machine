import React from 'react';
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

TagValueContainer.defaultProps = {
    multiple: false,
    setState: (value) => {
        console.log(['TagValueContainer', value]);
    }
};

export default TagValueContainer;
