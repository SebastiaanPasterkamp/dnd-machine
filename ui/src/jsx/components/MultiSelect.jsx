import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

import _ from 'lodash';

import BaseSelect from './BaseSelect.jsx';

class MultiSelect extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            selected: []
        };
    }

    onChange(item, checked) {
        if (this.props.isDisabled(item)) {
            return;
        }

        let selected = this.state.selected;
        if (checked) {
            selected = _.concat(selected, [item.code]);
        } else {
            selected = _.difference(selected, [item.code]);
        }
        this.setState({
            selected: selected
        }, () => {
            this.props.setState(this.state.selected);
        });
    }

    getLabel() {
        let label = this.props.label;
        if (this.state.selected.length == 1) {
            let item = _.find(this.props.items, {
                code: this.state.selected[0]
            });
            label = item.label;
        } else if (this.state.selected.length > 1) {
            label = this.state.selected.length + ' selected';
        }
        return label;
    }

    renderItem(item) {
        let checked = _.includes(this.state.selected, item.code);
        let style = [
            checked ? "info" : null,
            this.props.isDisabled(item) ? "disabled" : null
            ];
        return <li key={item.code}>
            <label><input
                    className={style.join(' ')}
                    type="checkbox"
                    defaultChecked={checked}
                    onChange={() => this.onChange(item, !checked)}
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
    isDisabled: (item) => {
        return item.disabled;
    },
    setState: (selected) => {
        console.log(['MultiSelect', selected]);
    }
};

export default MultiSelect;