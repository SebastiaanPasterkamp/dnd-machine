import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BaseSelect from './BaseSelect.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import utils from '../utils.jsx';

class SingleSelect extends LazyComponent
{
    onClick(item) {
        if (this.props.isDisabled(item)) {
            return;
        }

        this.props.setState(
            _.get(item, 'code', item.name)
        );
    }

    getLabel() {
        const {
            items,
            selected,
            emptyLabel,
        } = this.props;

        const item = (
            _.find(items, {code: selected})
            || _.find(items, {name: selected})
        );

        if (_.isNil(item)) {
            return emptyLabel;
        }

        return _.get(item, 'label', item.name);
    }

    renderItem(item) {
        const id = _.get(item, 'code', item.name);
        if (_.isNil(id)) {
            return null;
        }

        const {
            selected,
            isDisabled,
        } = this.props;

        const disabled = isDisabled(item);
        const style = utils.makeStyle({
            info: id === selected,
            disabled,
        });

        return <li
            key={ id }
            className={ style }
            data-value={ id }
            onClick={
                disabled
                ? null
                : () => this.onClick(item)
            }
            >
            <a>
                { _.get(item, 'label', item.name) }
            </a>
        </li>;
    }

    render() {
        const {
            items,
            selected,
            setState,
            isDisabled,
            emptyLabel,
            ...props,
        } = this.props;

        return <BaseSelect
            label={ this.getLabel() }
            {...props}
            >
            {_.map(
                items,
                item => this.renderItem(item)
            )}
        </BaseSelect>;
    }
}

SingleSelect.defaultProps = {
    isDisabled: (item) => item.disabled,
    setState: (selected) => {
        console.log(['SingleSelect', selected]);
    }
};

SingleSelect.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected: PropTypes.any,
    setState: PropTypes.func.isRequired,
    isDisabled: PropTypes.func.isRequired,
    emptyLabel: PropTypes.string,
};

export default SingleSelect;