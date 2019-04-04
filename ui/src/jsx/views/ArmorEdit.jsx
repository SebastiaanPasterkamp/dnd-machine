import React from 'react';
import _ from 'lodash';

import '../../sass/_edit-armor.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import CostEditor from '../components/CostEditor.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import StatsBlock from '../components/StatsBlock.jsx';
import TextField from '../components/TextField.jsx';

export class ArmorEdit extends React.Component
{
    constructor(props) {
        super(props);

        this.armor_method = [
            {code: "value", label: "Flat value"},
            {code: "bonus", label: "Bonus armor"},
            {code: "formula", label: "Formula"},
        ];
        this.stealth = [
            {code: false, label: "Unhindered"},
            {code: true, label: "Disadvantage"}
        ];

        this.state = {
            armor_method: null,
        };
    }

    onArmorMethod(from, to) {
        this.setState(
            {
                armor_method: to,
                [from]: this.props[from]
            },
            () => this.props.setState({
                [from]: undefined,
                [to]: this.state[to]
            })
        );
    }

    onFieldChange(field, value) {
        this.props.setState({[field]: value});
    }

    render() {
        let armor_method = this.state.armor_method || _.reduce(
            this.armor_method,
            (armor_method, method) => {
                if (!_.isNil(this.props[method.code])) {
                    armor_method = method.code;
                }
                return armor_method;
            },
            this.armor_method[0].code
        );

        const {
            type, armor_types = [], name, description, bonus, value, formula,
            requirements = {}, weight = {}, disadvantage,
            cost = {}
        } = this.props;

        const {
            code: defaultArmorType,
        } = armor_types[0] || {};

        return [
            <Panel
                    key="basics"
                    className="armor-edit__basics"
                    header="Basics"
                >
                <ControlGroup label="Type">
                    <SingleSelect
                        selected={type || defaultArmorType}
                        items={armor_types || []}
                        setState={(value) =>
                            this.onFieldChange('type', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={name}
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
                            type="number"
                            placeholder="Bonus..."
                            value={bonus}
                            setState={(value) => {
                                this.onFieldChange(
                                    'bonus',
                                    value || undefined
                                )
                            }} />
                        : null
                    }
                    {armor_method == 'value'
                        ? <InputField
                            type="number"
                            placeholder="Value..."
                            value={value}
                            setState={(value) => {
                                this.onFieldChange('value', value)
                            }} />
                        : null
                    }
                    {armor_method == 'formula'
                        ? <InputField
                            placeholder="Formula..."
                            value={formula}
                            setState={(value) => {
                                this.onFieldChange('formula', value)
                            }} />
                        : null
                    }
                </ControlGroup>
            </Panel>,

            <Panel
                    key="properties"
                    className="armor-edit__properties"
                    header="Properties"
                >
                <ControlGroup labels={["Requires", "Strength"]}>
                    <InputField
                        type="number"
                        placeholder="Strength..."
                        value={requirements.strength || null}
                        setState={(value) => {
                            this.onFieldChange('requirements', {
                                strength: value || undefined
                            })
                        }} />
                </ControlGroup>
                <ControlGroup labels={["Weight", "lb."]}>
                    <InputField
                        type="float"
                        placeholder="Pounds..."
                        value={weight.lb || ''}
                        setState={(value) => {
                            this.onFieldChange('weight', {lb: value});
                        }} />
                </ControlGroup>
                <ControlGroup label="Stealth">
                    <SingleSelect
                        selected={disadvantage || false}
                        items={this.stealth}
                        setState={(value) => {
                            this.onFieldChange('disadvantage', value);
                        }} />
                </ControlGroup>
                <ControlGroup label="Value">
                    <CostEditor
                        value={cost}
                        setState={(value) => {
                            this.onFieldChange('cost', value);
                        }} />
                </ControlGroup>
            </Panel>,

            <Panel
                key="description"
                className="armor-edit__description"
                header="Description"
                >
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={description || ''}
                        rows={5}
                        setState={value => {
                            this.onFieldChange('description', value);
                        }} />
                </ControlGroup>
            </Panel>,
        ];
    }
}

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        ArmorEdit, {
            className: 'armor-edit',
            icon: 'fa-shield',
            label: 'Armor',
            buttons: ['cancel', 'reload', 'save']
        },
        "armor",
        "items"
    ),
    [
        "armor_types"
    ],
    'items'
);
