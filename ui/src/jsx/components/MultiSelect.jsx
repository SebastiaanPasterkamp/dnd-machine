import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BaseSelect from './BaseSelect.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import utils from '../utils.jsx';

class MultiSelect extends LazyComponent
{
    onChange(item, checked) {
        const {
            selected,
            isDisabled,
            setState
        } = this.props;

        if (isDisabled(item)) {
            return;
        }

        const id = _.get(item, 'code', item.name);
        const newState = checked
            ? _.concat(selected, [id])
            : _.difference(selected, [id]);

        setState(newState);
    }

    getLabel() {
        const {
            items, label, selected, emptyLabel,
        } = this.props;

        if (selected.length == 1) {
            const { label = emptyLabel } = _.find(items, {
                code: selected[0]
            }) || {};

            return label;
        }

        if (selected.length > 1) {
            return selected.length + ' selected';
        }

        return emptyLabel;
    }

    renderItem(item) {
        const {
            selected,
            isDisabled,
        } = this.props;
        const id = _.get(item, 'code', item.name);
        const checked = _.includes(selected, id);
        const disabled = isDisabled(item);
        const style = utils.makeStyle({
            info: checked,
            disabled,
        });

        return <li
            key={id}
            data-value={id}
            className={style}
            >
            <label>
                <input
                    type="checkbox"
                    checked={ checked }
                    disabled={ disabled }
                    onChange={
                        disabled
                        ? null
                        : () => this.onChange(item, !checked)
                    }
                    />
                { _.get(item, 'label', item.name) }
            </label>
        </li>
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
            closeOnClick={ false }
            {...props}
            >
            {_.map(
                items,
                item => this.renderItem(item)
            )}
        </BaseSelect>;
    }
}

MultiSelect.defaultProps = {
    emptyLabel: "0 selected",
    isDisabled: (item) => item.disabled,
    setState: (selected) => {
        console.log(['MultiSelect', selected]);
    }
};

MultiSelect.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected: PropTypes.arrayOf(PropTypes.any).isRequired,
    setState: PropTypes.func.isRequired,
    isDisabled: PropTypes.func.isRequired,
    emptyLabel: PropTypes.string,
};

export default MultiSelect;