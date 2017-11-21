import React from 'react';
import _ from 'lodash';

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
        this.damage_type = [
            {code: "", label: ""},
            {code: "bludgeoning", label: "Bludgeoning"},
            {code: "force", label: "Force"},
            {code: "piercing", label: "Piercing"},
            {code: "slashing", label: "Slashing"}
        ];
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

    render() {
        return <ControlGroup labels={["Damage", "d", "+", "Type"]}>
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
                }} />
            <SingleSelect
                header="Damage type"
                selected={this.props.type}
                items={this.damage_type}
                setState={(value) => {
                    this.onFieldChange('type', damage)
                }} />
        </ControlGroup>;
    }
}

DamageEdit.defaultProps = {
    setState: (value) => {
        console.log(['DamageEdit', value]);
    }
};

export default DamageEdit;
