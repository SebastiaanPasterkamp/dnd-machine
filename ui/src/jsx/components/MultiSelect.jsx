import React from 'react';
import _ from 'lodash';

import BaseSelect from './BaseSelect.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import utils from '../utils.jsx';

class MultiSelect extends LazyComponent
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

    onChange(item, checked) {
        if (this.props.isDisabled(item)) {
            return;
        }
        let selected = [];
        const id = this.getId(item);
        if (checked) {
            selected = _.concat(this.props.selected, [id]);
        } else {
            selected = _.difference(this.props.selected, [id]);
        }

        this.props.setState(selected);
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
        const { selected } = this.props;
        const id = this.getId(item);
        let isChecked = _.includes(selected, id);
        let isDisabled = this.props.isDisabled(item)
        let style = utils.makeStyle({
            info: isChecked,
            disabled: isDisabled
        });
        return <li
                key={id}
                data-value={id}
                className={style}
                >
            <label><input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={
                        isDisabled
                            ? null
                            : () => this.onChange(item, !isChecked)}
                    />
                {this.getName(item)}
            </label>
        </li>
    }

    render() {
        return <BaseSelect
                label={this.getLabel()}
                closeOnClick={false}
                {...this.props}>
            {this.props.items
                .map((item) => this.renderItem(item))
            }
        </BaseSelect>;
    }
}

MultiSelect.defaultProps = {
    emptyLabel: "0 selected",
    isDisabled: (item) => {
        return item.disabled;
    },
    setState: (selected) => {
        console.log(['MultiSelect', selected]);
    }
};

export default MultiSelect;