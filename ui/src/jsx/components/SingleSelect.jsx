import React from 'react';
import PropTypes from 'prop-types';
import {
    find,
    isNil,
    map,
} from 'lodash/fp';

import BaseSelect from './BaseSelect.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import utils from '../utils.jsx';

class SingleSelect extends LazyComponent
{
    getItemValue(item) {
        const { code, id, name } = item;
        if (code !== undefined) {
            return code;
        }
        if (id !== undefined) {
            return id;
        }
        return name;
    }

    getItemText(item) {
        const { label, name } = item;
        if (label !== undefined) {
            return label;
        }
        return name;
    }

    onClick(item) {
        const { isDisabled, setState } = this.props;
        if (isDisabled(item)) {
            return;
        }

        setState(this.getItemValue(item));
    }

    getLabel() {
        const {
            items,
            selected,
            emptyLabel,
        } = this.props;

        const item = (
            find({code: selected}, items)
            || find({id: selected}, items)
            || find({name: selected}, items)
        );

        if (isNil(item)) {
            return emptyLabel;
        }

        return this.getItemText(item);
    }

    renderItem(item) {
        const id = this.getItemValue(item)
        if (isNil(id)) {
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

        return (
            <li
                key={ id }
                className={ style }
                data-value={ id }
                onClick={ disabled
                    ? null
                    : () => this.onClick(item)
                }
            >
                <a>
                    { this.getItemText(item) }
                </a>
            </li>
        );
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

        return (
            <BaseSelect
                label={ this.getLabel() }
                {...props}
            >
                {map(item => this.renderItem(item))(items)}
            </BaseSelect>
        );
    }
}

SingleSelect.defaultProps = {
    isDisabled: (item) => item.disabled,
    setState: (selected) => {
        console.log(['SingleSelect', selected]);
    },
};

SingleSelect.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected: PropTypes.any,
    setState: PropTypes.func.isRequired,
    isDisabled: PropTypes.func.isRequired,
    emptyLabel: PropTypes.string,
};

export default SingleSelect;
