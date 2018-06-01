import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BaseTagContainer from './BaseTagContainer.jsx';
import LazyComponent from './LazyComponent.jsx';

export class TagContainer extends LazyComponent
{
    onDelete(tag, index) {
        const { value, onDelete, setState } = this.props;

        setState(
            _.concat(
                _.slice(value, 0, index),
                _.slice(value, index + 1)
            )
        );

        if (onDelete) {
            onDelete(tag, index);
        }
    }

    onAdd(newValue) {
        const { value, onAdd, setState } = this.props;

        setState(
            _.concat(value, [newValue])
        );

        if (onAdd) {
            onAdd(newValue);
        }
    }

    getItems(multiple) {
        const { items = [], value } = this.props;
        const filtered = multiple
            ? items
            : _.filter(items, item => !(
                _.includes(value, item.code)
                || _.includes(value, item.name)
            ));

        return _.map(
            filtered,
            item => _.pickBy({
                id: item.code || item.name,
                code: item.code,
                name: item.name,
                label: item.label,
                description: item.description,
            }, v => (v !== undefined))
        );
    }

    getItem(tag) {
        const { items = [] } = this.props;
        const { code, name, label, description } = (
            _.find(items, { code: tag })
            || _.find(items, { name: tag })
            || {}
        );

        return _.pickBy({
            id: tag,
            code,
            name,
            label,
            description,
        }, v => (v !== undefined));
    }

    render() {
        const {
            value, setState, multiple, ...props,
        } = this.props;

        return <BaseTagContainer
            {...props}
            items={this.getItems(multiple)}
            onAdd={(newValue) => this.onAdd(newValue)}
            onDelete={(tag, index) => this.onDelete(tag, index)}
            value={_.map(value, tag => this.getItem(tag))}
            />;
    }
};

TagContainer.propTypes = _.assign({}, BaseTagContainer.propTypes, {
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    setState: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
});

export default TagContainer;
