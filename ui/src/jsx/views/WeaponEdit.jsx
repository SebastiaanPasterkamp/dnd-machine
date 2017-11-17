import React from 'react';
import _ from 'lodash';

import LoadableContainer from '../mixins/LoadableContainer.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import StatsBlock from '../components/StatsBlock.jsx';
import TextField from '../components/TextField.jsx';

export class WeaponEdit extends React.Component
{
    constructor(props) {
        super(props);

        this.types = [
            {code: "simple melee weapon", label: "Simple Melee Weapon"},
            {code: "simple ranged weapon", label: "Simple Ranged Weapon"},
            {code: "martial melee weapon", label: "Martial Melee Weapon"},
            {code: "martial ranged weapon", label: "Martial Ranged Weapon"},
        ];
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
        this.properties = [
            {'code': 'ammunition', 'label': 'Ammunition'},
            {'code': 'finesse', 'label': 'Finesse'},
            {'code': 'heavy', 'label': 'Heavy'},
            {'code': 'light', 'label': 'Light'},
            {'code': 'loading', 'label': 'Loading'},
            {'code': 'reach', 'label': 'Reach'},
            {'code': 'special', 'label': 'Special'},
            {'code': 'thrown', 'label': 'Thrown'},
            {'code': 'two-handed', 'label': 'Two-Handed'},
            {'code': 'versatile', 'label': 'Versatile'},
        ];
        this.coinage = [
            {'code': 'cp', 'label': 'Copper'},
            {'code': 'sp', 'label': 'Silver'},
            {'code': 'ep', 'label': 'Electrum'},
            {'code': 'gp', 'label': 'Gold'},
            {'code': 'pp', 'label': 'Platinum'}
        ];
    }

    onChangeType(value) {
        let update = {type: value};

        if (
            update.type.match('ranged')
            || _.indexOf(this.props.property, 'thrown') >= 0
        ) {
            if (!('range' in this.props)) {
                update.range = {
                    min: 5,
                    max: 5
                };
            }
        } else if ('range' in this.props) {
            update.range = undefined;
        }

        this.props.setState(update);
    }

    onChangeProperty(value) {
        let update = {property: value};

        if (_.indexOf(update.property, 'versatile') >= 0) {
            if (!('versatile' in this.props)) {
                update.versatile = {
                    dice_count: 1,
                    dice_size: 4,
                    type: 'bludgeoning'
                };
            }
        } else if ('versatile' in this.props) {
            update.versatile = undefined;
        }

        if (
            this.props.type.match('ranged')
            || _.indexOf(update.property, 'thrown') >= 0
        ) {
            if (!('range' in this.props)) {
                update.range = {
                    min: 5,
                    max: 5
                };
            }
        } else if ('range' in this.props) {
            update.range = undefined;
        }

        this.props.setState(update);
    }

    onFieldChange(field, value) {
        let update = [];
        update[field] = value;
        this.props.setState(update);
    }

    render() {
        return <div>
        <h2 className="icon fa-cutlery">Weapon</h2>

        <div id="edit-weapon" className="widget-grid">
            <Panel id="description" header="Description">
                <ControlGroup label="Type">
                    <SingleSelect
                        selected={this.props.type || this.types[0].code}
                        items={this.types}
                        setState={(value) =>
                            this.onChangeType(value)
                        } />
                </ControlGroup>
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={this.props.name}
                        setState={(value) =>
                            this.onFieldChange('name', value)
                        } />
                </ControlGroup>
                <ControlGroup labels={["Damage", "d", "+", "Type"]}>
                    <SingleSelect
                        header="Dice count"
                        selected={this.props.damage.dice_count}
                        items={this.dice_count}
                        setState={(value) => {
                            let damage = Object.assign(
                                {}, this.props.damage,
                                {dice_count: value}
                            );
                            this.onFieldChange('damage', damage)
                        }} />
                    <SingleSelect
                        header="Dice size"
                        selected={this.props.damage.dice_size}
                        items={this.dice_size}
                        setState={(value) => {
                            let damage = Object.assign(
                                {}, this.props.damage,
                                {dice_size: value}
                            );
                            this.onFieldChange('damage', damage)
                        }} />
                    <InputField
                        placeholder="Bonus..."
                        value={this.props.damage.dice_bonus || null}
                        setState={(value) => {
                            value = parseInt(value);
                            let damage = Object.assign(
                                {}, this.props.damage,
                                {dice_bonus: value}
                            );
                            if (!value) {
                                delete damage.dice_bonus;
                            }
                            this.onFieldChange('damage', damage)
                        }} />
                    <SingleSelect
                        header="Damage type"
                        selected={this.props.damage.type}
                        items={this.damage_type}
                        setState={(value) => {
                            let damage = Object.assign(
                                {}, this.props.damage,
                                {type: value}
                            );
                            this.onFieldChange('damage', damage)
                        }} />
                </ControlGroup>
                {this.props.versatile || null ?
                <ControlGroup labels={["Versatile", "d", "+", "Type"]}>
                    <SingleSelect
                        header="Dice count"
                        selected={this.props.versatile.dice_count}
                        items={this.dice_count}
                        setState={(value) => {
                            let versatile = Object.assign(
                                {}, this.props.versatile,
                                {dice_count: value}
                            );
                            this.onFieldChange('versatile', versatile)
                        }} />
                    <SingleSelect
                        header="Dice size"
                        selected={this.props.versatile.dice_size}
                        items={this.dice_size}
                        setState={(value) => {
                            let versatile = Object.assign(
                                {}, this.props.versatile,
                                {dice_size: value}
                            );
                            this.onFieldChange('versatile', versatile)
                        }} />
                    <InputField
                        placeholder="Bonus..."
                        value={this.props.versatile.dice_bonus || null}
                        setState={(value) => {
                            value = parseInt(value);
                            let versatile = Object.assign(
                                {}, this.props.versatile,
                                {dice_bonus: value}
                            );
                            if (!value) {
                                delete versatile.dice_bonus;
                            }
                            this.onFieldChange('versatile', versatile)
                        }} />
                    <SingleSelect
                        header="Damage type"
                        selected={this.props.versatile.type}
                        items={this.damage_type}
                        setState={(value) => {
                            let versatile = Object.assign(
                                {}, this.props.versatile,
                                {type: value}
                            );
                            this.onFieldChange('versatile', versatile)
                        }} />
                </ControlGroup> : null}
            </Panel>

            <Panel id="properties" header="Properties">
                <ControlGroup label="Properties">
                    <MultiSelect
                        header="Property"
                        selected={this.props.property}
                        items={this.properties}
                        setState={(value) => {
                            this.onChangeProperty(value)
                        }} />
                </ControlGroup>
                {this.props.range || null ?
                <ControlGroup labels={["Range", "ft.", "ft."]}>
                    <InputField
                        placeholder="Normal..."
                        value={'range' in this.props
                            ? this.props.range.min || ''
                            : ''
                        }
                        setState={(value) => {
                            let range = Object.assign({},
                                this.props.range,
                                {min: parseInt(value) || null}
                            );
                            this.onFieldChange('range', range);
                        }} />
                    <InputField
                        placeholder="Disadvantage..."
                        value={'range' in this.props
                            ? this.props.range.max || ''
                            : ''
                        }
                        setState={(value) => {
                            let range = Object.assign({},
                                this.props.range,
                                {max: parseInt(value) || null}
                            );
                            this.onFieldChange('range', range);
                        }} />
                </ControlGroup> : null}
                <ControlGroup labels={["Weight", "lb."]}>
                    <InputField
                        placeholder="Pounds..."
                        value={'weight' in this.props
                            ? this.props.weight.lb
                            : ''
                        }
                        setState={(value) => {
                            value = parseFloat(value) || null;
                            this.onFieldChange('weight', {lb: value});
                        }} />
                </ControlGroup>
                {_.map(this.coinage, (coinage) => {
                    return <ControlGroup
                        key={coinage.code} label={coinage.label}>
                    <InputField
                        type="number"
                        placeholder="Amount..."
                        value={this.props.cost[coinage.code] || ''}
                        setState={(value) => {
                            let update = {};
                            update[coinage.code] = parseInt(value) || null;
                            let cost = Object.assign({},
                                this.props.cost,
                                update
                            );
                            this.onFieldChange('cost', cost);
                        }} />
                </ControlGroup>})}
            </Panel>

            <Panel id="save" header="Save">
                {this.props.cancel
                    ? <ButtonField
                        name="button"
                        value="cancel"
                        color="muted"
                        icon="ban"
                        onClick={() => this.props.cancel()}
                        label="Cancel" />
                    : null
                }
                {this.props.reload
                    ? <ButtonField
                        name="button"
                        value="reload"
                        color="info"
                        icon="refresh"
                        onClick={() => this.props.reload()}
                        label="Reload" />
                    : null
                }
                {this.props.save
                    ? <ButtonField
                        name="button"
                        value="cancel"
                        color="primary"
                        icon="save"
                        onClick={() => this.props.save()}
                        label="Save" />
                    : null
                }
            </Panel>
        </div>
    </div>;
    }
}

class LoadableWeaponEdit extends React.Component
{
    render() {
        return <LoadableContainer
            loadableType="weapons"
            loadableGroup="items"
            component={WeaponEdit}
            {...this.props}
            />;
    }
}

export default LoadableWeaponEdit;