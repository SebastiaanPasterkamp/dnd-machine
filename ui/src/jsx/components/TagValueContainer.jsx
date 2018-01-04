import React from 'react';
import _ from 'lodash';

import '../../sass/_list-component.scss';

import LazyComponent from './LazyComponent.jsx';
import SingleSelect from '../components/SingleSelect.jsx';

export class TagValueContainer extends LazyComponent
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

    onDelete(key) {
        this.onChange(key, undefined);
    }

    onAdd(key) {
        const item = this.props.tagValues[0];
        this.onChange(key, this.props.defaultValue || item.code);
    }

    isDisabled(item) {
        if (this.props.multiple || false) {
            return false;
        }
        if (_.has(this.props.tags, item.code)) {
            return true;
        }
        return false;
    }

    renderTag(key, value) {
        const item = _.find(this.props.tagOptions, {code: key})
            || {label: value, color: 'bad'};
        var style = ["nice-tag"];
        if ('color' in item) {
            style.push(item.color);
        }

        return <div key={key} className={style.join(' ')}>
            <span className="nice-tag-label">
                {item.label}
            </span>
            <span className="nice-tag-badge">
                {value}
                <div className="nice-tag-dropdown hover">
                    <ul>
                        {_.map(this.props.tagValues, (option) => {
                            return <li key={option.code}>
                                <a onClick={() => this.onChange(
                                    key, option.label
                                    )}>
                                    {option.label}
                                </a>
                            </li>;
                        })}
                    </ul>
                </div>
            </span>
            <button
                    className="nice-tag-btn"
                    onClick={() => this.onDelete(key)}
                    >
                <i className="icon fa-trash-o"></i>
            </button>
        </div>;
    }

    render() {
        return <div className="nice-tags-container">
            {_.map(this.props.tags, (value, key) => {
                return this.renderTag(key, value);
            })}
            <SingleSelect
                emptyLabel="Add..."
                items={this.props.tagOptions}
                setState={
                    (key) => this.onAdd(key)
                }
                isDisabled={(item) => this.isDisabled(item)}
                />
        </div>
    }
}

TagValueContainer.defaultProps = {
    multiple: false,
    setState: (value) => {
        console.log(['TagValueContainer', value]);
    }
};

export default TagValueContainer;
