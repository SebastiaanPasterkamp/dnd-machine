import React from 'react';
import _ from 'lodash';

import '../../sass/_edit-weapon.scss';

import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import DamageEdit from '../components/DamageEdit.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import ReachEdit from '../components/ReachEdit.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import StatsBlock from '../components/StatsBlock.jsx';
import TagContainer from '../components/TagContainer.jsx';
import TagValueContainer from '../components/TagValueContainer.jsx';

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
        this.coins = _.range(1, 100)
            .map((i) => {
                return {code: i, label: i}
            });
    }

    onComponentDidMount() {
        this.fixConditionalFields();
    }

    fixConditionalFields() {
        let fix = [];
        if (
            this.props.type.match('ranged')
            || _.includes(this.props.property, 'thrown')
        ) {
            if (!this.props.range) {
                fix.range = {
                    min: 5,
                    max: 5
                };
            }
        } else if ('range' in this.props) {
            fix.range = null;
        }

        if (_.includes(this.props.property, 'versatile')) {
            if (!this.props.versatile) {
                fix.versatile = this.props.damage;
            }
        } else if ('versatile' in this.props) {
            fix.versatile = null;
        }

        console.log(fix);

        if (fix) {
            this.props.setState(fix);
        }
    }

    onFieldChange(field, value) {
        let update = [];
        update[field] = value;
        this.props.setState(
            update,
            () => this.fixConditionalFields()
        );
    }

    render() {
        return [
            <Panel
                    key="description"
                    className="weapon-edit__description"
                    header="Description"
                >
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
                    setState={(value) => {
                        this.onFieldChange('damage', value);
                    }}
                    />
                {this.props.versatile
                    ? <DamageEdit
                        label="Versatile"
                        {...this.props.versatile}
                        setState={(value) => {
                            this.onFieldChange('versatile', value);
                        }}
                        />
                    : null
                }
            </Panel>,

            <Panel
                    key="properties"
                    className="weapon-edit__properties"
                    header="Properties"
                >
                <ControlGroup label="Attributes">
                    <TagContainer
                        tags={this.props.property || []}
                        tagOptions={this.properties || []}
                        setState={(value) => {
                            this.onFieldChange('property', value);
                        }} />
                </ControlGroup>
                {this.props.range
                    ? <ReachEdit
                        {...this.props.range}
                        setState={(range) => {
                            this.onFieldChange('range', range);
                        }}
                        />
                    : null
                }
                <ControlGroup labels={["Weight", "lb."]}>
                    <InputField
                        type="float"
                        placeholder="Pounds..."
                        value={'weight' in this.props
                            ? this.props.weight.lb
                            : ''
                        }
                        setState={(value) => {
                            this.onFieldChange('weight', {lb: value});
                        }} />
                </ControlGroup>

                <ControlGroup label="Value">
                    <TagValueContainer
                        tags={this.props.cost}
                        tagOptions={this.coinage}
                        tagValues={this.coins}
                        setState={(value) => {
                            this.onFieldChange('cost', value);
                        }} />
                </ControlGroup>
            </Panel>
        ];
    }
}

export default RoutedObjectDataWrapper(
    WeaponEdit, {
        className: 'weapon-edit',
        icon: 'fa-cutlery',
        label: 'Weapon',
        buttons: ['cancel', 'reload', 'recompute', 'save']
    }, "weapons", "items"
);
