import React from 'react';
import PropTypes from 'prop-types';
import LazyComponent from '../components/LazyComponent.jsx';

import _ from 'lodash';

import BaseSelect from './BaseSelect.jsx';

class SingleSelect extends LazyComponent
{
    getId(item) {
        if ('code' in item) {
            return item.code;
        }
        return item.name;
    }

    getName(item) {
        if ('label' in item) {
            return item.label;
        }
        return item.name;
    }

    onClick(item) {
        if (this.props.isDisabled(item)) {
            return;
        }

        this.props.setState(this.getId(item));
    }

    getLabel() {
        let label = this.props.emptyLabel;
        let item = _.find(
            this.props.items,
            {code: this.props.selected}
        ) || _.find(
            this.props.items,
            {name: this.props.selected}
        );
        if (
            !_.isNil(item)
            && !_.isNil(this.getId(item))
        ) {
            label = this.getName(item);
        }
        return label;
    }

    renderItem(item) {
        if (_.isNil(this.getId(item))) {
            return null;
        }
        let isDisabled = this.props.isDisabled(item);
        let style = _.filter([
            this.getId(item) == this.props.selected
                ? "info"
                : null,
            isDisabled
                ? "disabled"
                : null
            ]);
        return <li
                key={this.getId(item)}
                className={style.length ? style.join(' ') : null}
                data-value={this.getId(item)}
                onClick={isDisabled
                    ? null
                    : () => this.onClick(item)
                }
                >
            <a>{this.getName(item)}</a>
        </li>
    }

    render() {
        return <BaseSelect
                label={this.getLabel()}
                {...this.props}>
            {_.map(
                this.props.items,
                item => this.renderItem(item)
            )}
        </BaseSelect>;
    }
}

SingleSelect.defaultProps = {
    isDisabled: (item) => {
        return (
            'disabled' in item
            && item.disabled
        );
    },
    setState: (selected) => {
        console.log(['SingleSelect', selected]);
    }
};

SingleSelect.propTypes = {
    isDisabled: PropTypes.func.isRequired,
    setState: PropTypes.func.isRequired,
    emptyLabel: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected: PropTypes.any,

};

export default SingleSelect;