import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BaseTagContainer from './BaseTagContainer.jsx';

export class TagContainer extends BaseTagContainer
{
    onChange(key, value) {
        const {tags, onChange} = this.props;
        const head = _.take(tags, key);
        const tail = _.takeRight(tags, tags.length - key - 1);
        this.props.setState(
            head.concat([value]).concat(tail)
        );
        if (onChange) {
            onChange(key, value);
        }
    }

    onDelete(key, value) {
        const {tags, onDelete} = this.props;
        const head = _.take(tags, key);
        const tail = _.takeRight(tags, tags.length - key - 1);
        this.props.setState(
            head.concat(tail)
        );
        if (onDelete) {
            onDelete(key, value);
        }
    }

    onAdd(value) {
        const {tags, onAdd} = this.props;
        const head = _.take(tags, tags.length);
        this.props.setState(
            head.concat([value])
        );
        if (onAdd) {
            onAdd(value);
        }
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

TagContainer.propTypes = {
    tagOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    onAdd: PropTypes.func,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
};

export default TagContainer;
