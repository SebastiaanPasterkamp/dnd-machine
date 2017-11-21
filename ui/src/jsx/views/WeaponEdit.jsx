import React from 'react';
import _ from 'lodash';

import LoadableContainer from '../mixins/LoadableContainer.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import DamageEdit from '../components/DamageEdit.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import ReachEdit from '../components/ReachEdit.jsx';
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

    onFieldChange(field, value) {
        let update = [];
        update[field] = value;
        this.props.setState(update);
    }

    render() {
        let range = null,
            versatile = null;

        if (
            this.props.type.match('ranged')
            || _.indexOf(this.props.property, 'thrown') >= 0
        ) {
            range = this.props.range || {
                min: 5,
                max: 5
            };
        }

        if (_.indexOf(this.props.property, 'versatile') >= 0) {
            versatile = this.props.versatile || {
                dice_count: 1,
                dice_size: 4,
                type: 'bludgeoning'
            };
        }

        return <div>
        <h2 className="icon fa-cutlery">Weapon</h2>

        <div id="edit-weapon" className="widget-grid">
            <Panel id="description" header="Description">
                <ControlGroup label="Type">
                    <SingleSelect
                        selected={this.props.type || this.types[0].code}
                        items={this.types}
                        setState={(value) =>
                            this.onFieldChange('type', value)
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
                <DamageEdit
                    {...this.props.damage}
                    setState={(damage) => {
                        this.onFieldChange('damage', damage);
                    }}
                    />
                {versatile || null
                    ? <DamageEdit
                        {...versatile}
                        setState={(versatile) => {
                            this.onFieldChange('versatile', versatile);
                        }}
                        />
                    : null
                }
            </Panel>

            <Panel id="properties" header="Properties">
                <ControlGroup label="Properties">
                    <MultiSelect
                        header="Property"
                        selected={this.props.property}
                        items={this.properties}
                        setState={(value) => {
                            this.onFieldChange('property', value);
                        }} />
                </ControlGroup>
                {range || null
                    ? <ReachEdit
                        {...range}
                        setState={(range) => {
                            this.onFieldChange('range', range);
                        }}
                        />
                    : null
                }
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

export default LoadableContainer(WeaponEdit, "weapons", "items");
