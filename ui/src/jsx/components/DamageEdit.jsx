import React from 'react';
import _ from 'lodash';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';

import LazyComponent from './LazyComponent.jsx';

import ControlGroup from './ControlGroup.jsx';
import InputField from './InputField.jsx';
import SingleSelect from './SingleSelect.jsx';

export class DamageEdit extends LazyComponent
{
    constructor(props) {
        super(props);

        this.dice_count = _.range(0, 20)
            .map((count) => {
                return {
                    code: count,
                    label: count
                };
            });
        this.dice_size = [4, 6, 8, 10, 12].map((size) => {
            return {
                code: size,
                label: size
            };
        });
    }

    onFieldChange(field, value) {
        let state = {
            dice_count: this.props.dice_count,
            dice_size: this.props.dice_size,
            bonus: this.props.bonus,
            type: this.props.type,
        };
        state[field] = value;
        this.props.setState(state);
    }

    dmgTypeIsDisabled(item) {
        const disabled = this.props.disabledTypes || [];
        if (this.props.type == item.code) {
            return false;
        }
        if (_.includes(disabled, item.code)) {
            return true;
        }
        return false;
    }

    render() {
        return <ControlGroup labels={[this.props.label, "d", "+", "Type"]}>
            <SingleSelect
                header="Dice count"
                selected={this.props.dice_count}
                items={this.dice_count}
                setState={(value) => {
                    this.onFieldChange('dice_count', parseInt(value));
                }} />
            <SingleSelect
                header="Dice size"
                selected={this.props.dice_size}
                items={this.dice_size}
                setState={(value) => {
                    this.onFieldChange('dice_size', parseInt(value));
                }} />
            <InputField
                placeholder="Bonus..."
                value={this.props.bonus || null}
                setState={(value) => {
                    this.onFieldChange(
                        'bonus',
                        value ? parseInt(value) : undefined
                    );
                }}
                />
            <SingleSelect
                header="Damage type"
                selected={this.props.type}
                items={this.props.damage_types}
                setState={(value) => {
                    this.onFieldChange('type', value)
                }}
                isDisabled={(item) => this.dmgTypeIsDisabled(item)}
                />
        </ControlGroup>;
    }
}

DamageEdit.defaultProps = {
    label: 'Damage',
    setState: (value) => {
        console.log(['DamageEdit', value]);
    }
};

export default ListDataWrapper(
    DamageEdit,
    ['damage_types'],
    'items'
);
