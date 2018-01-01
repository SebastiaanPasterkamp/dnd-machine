import React from 'react';
import _ from 'lodash';

import '../../sass/_list-component.scss';

import LazyComponent from './LazyComponent.jsx';
import SingleSelect from '../components/SingleSelect.jsx';

export class TagContainer extends LazyComponent
{
    onChange(index, value) {
        let head = _.take(
                this.props.tags, index),
            tail = _.takeRight(
                this.props.tags, this.props.tags.length - index - 1);
        this.props.setState(head.concat([value]).concat(tail));
    }

    onDelete(index) {
        let head = _.take(
                this.props.tags, index),
            tail = _.takeRight(
                this.props.tags, this.props.tags.length - index - 1);
        this.props.setState(head.concat(tail));
    }

    onAdd(value) {
        let head = _.take(
                this.props.tags, this.props.tags.length);
        this.props.setState(head.concat([value]));
    }

    isDisabled(item) {
        if (_.has(this.props.tags, item.code)) {
            return true;
        }
        return false;
    }

    renderTag(index, value) {
        const item = _.find(this.props.tagOptions, {code: value})
            || {label: value, color: 'bad'};
        var style = ["nice-tag"];
        if ('color' in item) {
            style.push(item.color);
        }

        return <div key={index} className={style.join(' ')}>
            <span className="nice-tag-label">
                {item.label}
            </span>
            <button
                    className="nice-tag-btn"
                    onClick={() => this.onDelete(index)}
                    >
                <i className="icon fa-trash-o"></i>
            </button>
        </div>;
    }

    render() {
        return <div className="nice-tags-container">
            {_.map(this.props.tags, (value, index) => {
                return this.renderTag(index, value);
            })}
            <SingleSelect
                emptyLabel="Add..."
                items={this.props.tagOptions}
                setState={
                    (value) => this.onAdd(value)
                }
                isDisabled={(item) => this.isDisabled(item)}
                />
        </div>
    }
}

TagContainer.defaultProps = {
    setState: (value) => {
        console.log(['TagContainer', value]);
    }
};

export default TagContainer;
