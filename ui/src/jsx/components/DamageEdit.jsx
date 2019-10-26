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

        this.dice_count = _.range(0, 20).map((count) => ({
            code: count,
            label: count
        }));
        this.dice_size = [4, 6, 8, 10, 12].map((size) => ({
            code: size,
            label: size
        }));
    }

    onFieldChange(field, value) {
        const { dice_count, dice_size, bonus, type } = this.props;
        const state = _.assign(
            {},
            { dice_count, dice_size, bonus, type },
            {[field]: value}
        );
        this.props.setState(state);
    }

    dmgTypeIsDisabled(item) {
        const {
            disabledTypes = [], type
        } = this.props;

        if (type == item.code) {
            return false;
        }
        if (_.includes(disabledTypes, item.code)) {
            return true;
        }
        return false;
    }

    render() {
        const {
            label, dice_count, dice_size, bonus = null, type,
            damage_types = []
        } = this.props;

        return <ControlGroup labels={[label, "d", "+", "Type"]}>
            <SingleSelect
                emptyLabel="Dice count"
                selected={dice_count}
                items={this.dice_count}
                setState={(value) => {
                    this.onFieldChange('dice_count', parseInt(value));
                }} />
            <SingleSelect
                emptyLabel="Dice size"
                selected={dice_size}
                items={this.dice_size}
                setState={(value) => {
                    this.onFieldChange('dice_size', parseInt(value));
                }} />
            <InputField
                placeholder="Bonus..."
                value={bonus || ''}
                setState={(value) => {
                    this.onFieldChange(
                        'bonus',
                        value ? parseInt(value) : undefined
                    );
                }}
                />
            <SingleSelect
                emptyLabel="Damage type"
                selected={type}
                items={damage_types}
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
