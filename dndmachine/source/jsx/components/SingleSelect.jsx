import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

import _ from 'lodash';

import BaseSelect from './BaseSelect.jsx';

class SingleSelect extends React.Component
{
    constructor(props) {
        super(props);
    }

    onClick(item) {
        if (this.props.isDisabled(item)) {
            return;
        }

        this.props.setState(item.code);
    }

    getLabel() {
        let label = this.props.label;
        let item = _.find(this.props.items, {
            code: this.props.selected
        });
        if (!_.isUndefined(item)) {
            label = item.label;
        }
        return label;
    }

    renderItem(item) {
        let style = [
            item.code == this.props.selected ? "info" : null,
            this.props.isDisabled(item) ? "disabled" : null
            ];
        return <li
                key={item.code}
                className={style.join(' ')}
                onClick={() => this.onClick(item)}
                >
            <a>{item.label}</a>
        </li>
    }

    render() {
        return <BaseSelect
                label={this.getLabel()}
                {...this.props}>
            {this.props.items
                .map((item) => this.renderItem(item))
            }
        </BaseSelect>;
    }
}

SingleSelect.defaultProps = {
    isDisabled: (item) => {
        return item.disabled;
    },
    setState: (selected) => {
        console.log(['SingleSelect', selected]);
    }
};

export default SingleSelect;