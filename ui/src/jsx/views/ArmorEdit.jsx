import React from 'react';
import _ from 'lodash';

import '../../sass/_edit-armor.scss';

import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import StatsBlock from '../components/StatsBlock.jsx';
import TextField from '../components/TextField.jsx';

export class ArmorEdit extends React.Component
{
    constructor(props) {
        super(props);

        this.types = [
            {code: "light armor", label: "Light Armor"},
            {code: "medium armor", label: "Medium Armor"},
            {code: "heavy armor", label: "Heavy Armor"},
            {code: "shield armor", label: "Shields"},
        ];
        this.armor_method = [
            {code: "value", label: "Flat value"},
            {code: "bonus", label: "Bonus armor"},
            {code: "formula", label: "Formula"},
        ];
        this.stealth = [
            {code: false, label: "Unhindered"},
            {code: true, label: "Disadvantage"}
        ];
        this.coinage = [
            {'code': 'cp', 'label': 'Copper'},
            {'code': 'sp', 'label': 'Silver'},
            {'code': 'ep', 'label': 'Electrum'},
            {'code': 'gp', 'label': 'Gold'},
            {'code': 'pp', 'label': 'Platinum'}
        ];

        this.state = {};
    }

    onArmorMethod(from, to) {
        let update = [];
        update[from] = undefined;
        update[to] = this.state[to] || null;
        this.props.setState(update);
    }

    onFieldChange(field, value) {
        let update = [];
        update[field] = value;
        this.setState(update);
        this.props.setState(update);
    }

    render() {
        let armor_method = this.armor_method[0].code;
        this.armor_method.map((method) => {
            if (
                method.code in this.props
                && this.props[method.code] !== undefined
            ) {
                armor_method = method.code;
            }
        });

        return <div>
        <h2 className="icon fa-shield">Armor</h2>

        <div id="edit-armor">
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
                <ControlGroup labels={["AC", ":"]}>
                    <SingleSelect
                        header="Armor method"
                        selected={armor_method}
                        items={this.armor_method}
                        setState={(value) => {
                            this.onArmorMethod(
                                armor_method,
                                value
                            );
                        }} />
                    {armor_method == 'bonus'
                        ? <InputField
                            placeholder="Bonus..."
                            value={this.props.bonus || null}
                            setState={(value) => {
                                value = parseInt(value);
                                this.onFieldChange('bonus', value)
                            }} />
                        : null
                    }
                    {armor_method == 'value'
                        ? <InputField
                            placeholder="Value..."
                            value={this.props.value || null}
                            setState={(value) => {
                                value = parseInt(value);
                                this.onFieldChange('value', value)
                            }} />
                        : null
                    }
                    {armor_method == 'formula'
                        ? <InputField
                            placeholder="Formula..."
                            value={this.props.formula || null}
                            setState={(value) => {
                                this.onFieldChange('formula', value)
                            }} />
                        : null
                    }
                </ControlGroup>
            </Panel>

            <Panel id="properties" header="Properties">
                <ControlGroup labels={["Requires", "Strength"]}>
                    <InputField
                        placeholder="Strength..."
                        value={this.props.requirements.strength || null}
                        setState={(value) => {
                            value = parseInt(value);
                            this.onFieldChange('requirements', {
                                strength: value || undefined
                            })
                        }} />
                </ControlGroup>
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
                <ControlGroup label="Stealth">
                    <SingleSelect
                        selected={this.props.disadvantage || false}
                        items={this.stealth}
                        setState={(value) => {
                            this.onFieldChange('disadvantage', value);
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

export default RoutedObjectDataWrapper(
    ArmorEdit, "armor", "items"
);
