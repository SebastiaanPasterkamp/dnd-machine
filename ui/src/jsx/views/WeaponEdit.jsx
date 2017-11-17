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
            {code: "marshal melee weapon", label: "Marshal Melee Weapon"},
            {code: "marshal ranged weapon", label: "Marshal Ranged Weapon"},
        ];
        this.dice_count = _.range(1, 20)
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
            {code: "bludgeoning", label: "Bludgeoning"},
            {code: "force", label: "Force"},
            {code: "piercing", label: "Piercing"},
            {code: "slashing", label: "Slashing"}
        ];
    }

    onFieldChange(field, value) {
        let update = [];
        update[field] = value;
        this.props.setState(update);
    }

    render() {
        return <div>
        <h2 className="icon fa-cutlery">Weapon</h2>

        <div id="edit-weapon">
            <Panel id="description" header="Description">
                <ControlGroup label="Type">
                    <SingleSelect
                        selected={this.props.type || this.types[0].code}
                        items={this.types}
                        setState={
                            (value) => this.onFieldChange('type', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={this.props.name}
                        setState={
                            (value) => this.onFieldChange('name', value)
                        } />
                </ControlGroup>
                <ControlGroup labels={["Damage", "d", "Type"]}>
                    <SingleSelect
                        header="Dice count"
                        selected={this.props.damage.dice_count || 1}
                        items={this.dice_count}
                        setState={
                            (value) => {
                                let damage = Object.assign(
                                    {}, this.props.damage,
                                    {dice_count: value}
                                );
                                this.onFieldChange('damage', damage)
                            }
                        } />
                    <SingleSelect
                        header="Dice size"
                        selected={
                            this.props.damage.dice_size
                            || this.dice_size[0].code
                        }
                        items={this.dice_size}
                        setState={
                            (value) => {
                                let damage = Object.assign(
                                    {}, this.props.damage,
                                    {dice_size: value}
                                );
                                this.onFieldChange('damage', damage)
                            }
                        } />
                    <SingleSelect
                        header="Damage type"
                        selected={
                            this.props.damage.type
                            || this.damage_type[0].code
                        }
                        items={this.damage_type}
                        setState={
                            (value) => {
                                let damage = Object.assign(
                                    {}, this.props.damage,
                                    {type: value}
                                );
                                this.onFieldChange('damage', damage)
                            }
                        } />
                </ControlGroup>
                <ControlGroup labels={["Versatile", "d", "Type"]}>
                    <SingleSelect
                        header="Dice count"
                        selected={this.props.versatile.dice_count || 1}
                        items={this.dice_count}
                        setState={
                            (value) => {
                                let versatile = Object.assign(
                                    {}, this.props.versatile,
                                    {dice_count: value}
                                );
                                this.onFieldChange('versatile', versatile)
                            }
                        } />
                    <SingleSelect
                        header="Dice size"
                        selected={
                            this.props.versatile.dice_size
                            || this.dice_size[0].code
                        }
                        items={this.dice_size}
                        setState={
                            (value) => {
                                let versatile = Object.assign(
                                    {}, this.props.versatile,
                                    {dice_size: value}
                                );
                                this.onFieldChange('versatile', versatile)
                            }
                        } />
                    <SingleSelect
                        header="Damage type"
                        selected={
                            this.props.damage.type
                            || this.damage_type[0].code
                        }
                        items={this.damage_type}
                        setState={
                            (value) => {
                                let damage = Object.assign(
                                    {}, this.props.damage,
                                    {type: value}
                                );
                                this.onFieldChange('damage', damage)
                            }
                        } />
                </ControlGroup>
            </Panel>

            <Panel id="properties" header="Properties">
                Blah
            </Panel>

            <Panel id="save" header="Save">
                <ButtonField
                    name="button"
                    value="cancel"
                    color="muted"
                    icon="ban"
                    label="Cancel" />
                {this.props.reload
                    ? <ButtonField
                        name="button"
                        value="cancel"
                        color="info"
                        icon="refresh"
                        onClick={() => this.props.reload()}
                        label="Update" />
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
            loadableType="weapon"
            loadableAPI={'/items/api'}
            component={WeaponEdit}
            {...this.props}
            />;
    }
}

export default LoadableWeaponEdit;