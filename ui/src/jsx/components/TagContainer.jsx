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

    isDisabled(item) {
        if (this.props.multiple || false) {
            return false;
        }
        const tags = this.getTags();
        const tag = (item.code || item.name)
        if (_.includes(tags, tag)) {
            return true;
        }
        return false;
    }

}

TagContainer.defaultProps = _.assign({}, BaseTagContainer.defaultProps, {
    setState: (value) => {
        console.log(['TagContainer', value]);
    }
});

TagContainer.propTypes = _.assign({}, BaseTagContainer.propTypes, {
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    onAdd: PropTypes.func,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
});

export default TagContainer;
