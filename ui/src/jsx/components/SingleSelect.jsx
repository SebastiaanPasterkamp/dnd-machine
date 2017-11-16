import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

import _ from 'lodash';

import BaseSelect from './BaseSelect.jsx';

class SingleSelect extends LazyComponent
{
    onClick(item) {
        if (this.props.isDisabled(item)) {
            return;
        }

        this.props.setState(item.code);
    }

    getLabel() {
        let label = this.props.emptyLabel;
        let item = _.find(this.props.items, {
            code: this.props.selected
        });
        if (!_.isUndefined(item)) {
            label = item.label;
        }
        return label;
    }

    renderItem(item) {
        let isDisabled = this.props.isDisabled(item);
        let style = _.filter([
            item.code == this.props.selected ? "info" : null,
            isDisabled ? "disabled" : null
            ]);
        return <li
                key={item.code}
                className={style.length ? style.join(' ') : null}
                data-value={item.code}
                onClick={isDisabled
                    ? null
                    : () => this.onClick(item)
                }
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
    emptyLabel: "",
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

export default SingleSelect;