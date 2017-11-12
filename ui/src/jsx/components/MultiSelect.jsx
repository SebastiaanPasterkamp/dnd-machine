import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

import _ from 'lodash';

import BaseSelect from './BaseSelect.jsx';

class MultiSelect extends LazyComponent
{
    constructor(props) {
        super(props);
    }

    onChange(item, checked) {
        if (this.props.isDisabled(item)) {
            return;
        }

        let selected = this.props.selected;
        if (checked) {
            selected = _.concat(selected, [item.code]);
        } else {
            selected = _.difference(selected, [item.code]);
        }

        this.props.setState(selected);
    }

    getLabel() {
        let label = this.props.emptyLabel;
        if (this.props.selected.length == 1) {
            let item = _.find(this.props.items, {
                code: this.props.selected[0]
            });
            label = item.label;
        } else if (this.props.selected.length > 1) {
            label = this.props.selected.length + ' selected';
        }
        return label;
    }

    renderItem(item) {
        let isChecked = _.includes(this.props.selected, item.code);
        let isDisabled = this.props.isDisabled(item)
        let style = [
            isChecked ? "info" : null,
            isDisabled ? "disabled" : null
            ];
        return <li
                key={item.code}
                data-value={item.code}
                className={_.filter(style).join(' ')}
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
                {item.label}
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