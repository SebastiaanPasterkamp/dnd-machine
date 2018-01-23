import React from 'react';
import _ from 'lodash';

import BaseTagContainer from './BaseTagContainer.jsx';

export class TagContainer extends BaseTagContainer
{
    onChange(key, value) {
        let head = _.take(
                this.props.tags, key),
            tail = _.takeRight(
                this.props.tags, this.props.tags.length - key - 1);
        this.props.setState(head.concat([value]).concat(tail));
    }

    onDelete(key, value) {
        let head = _.take(
                this.props.tags, key),
            tail = _.takeRight(
                this.props.tags, this.props.tags.length - key - 1);
        this.props.setState(head.concat(tail));
    }

    onAdd(value) {
        let head = _.take(
                this.props.tags, this.props.tags.length);
        this.props.setState(head.concat([value]));
    }

    getItem(key, value) {
        return _.find(this.props.tagOptions, {code: value})
            || _.find(this.props.tagOptions, {name: value})
    }
}

TagContainer.defaultProps = {
    multiple: false,
    showSelect: true,
    setState: (value) => {
        console.log(['TagContainer', value]);
    }
};

export default TagContainer;
