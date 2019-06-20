import React from 'react';
import {
    reduce,
} from 'lodash/fp';

import { memoize } from '../utils';

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

        this.state = this.constructor.getDerivedStateFromProps(
            props,
            {},
        );

        this.memoize = memoize.bind(this);
    }

    onArmorMethod = (to) => {
        const { armor_method: from } = this.state;
        this.setState(
            {
                armor_method: to,
                [from]: this.props[from],
            },
            () => this.props.setState({
                [from]: undefined,
                [to]: this.state[to],
            })
        );
    }

    onFieldChange = (field) => {
        const { setState } = this.props;
        return this.memoize(field, value => {
            setState({ [field]: value });
        });
    }

    onFieldChangeDefault = (field, alternative) => {
        const { setState } = this.props;
        return this.memoize(field, value => {
            setState({ [field]: value || alternative });
        });
    }

    static getDerivedStateFromProps(props, state) {
        const armor_method = reduce(
            (armor_method, method) => {
                if (props[method]) {
                    return method;
                }
                return armor_method;
            },
            state.armor_method || "value"
        )([ "value", "bonus", "formula" ]);
        if (armor_method === state.armor_method) {
            return null;
        }
        return { armor_method };
    }

    render() {
        const { armor_method } = this.state;
        const {
            type, armor_types, name, description, bonus, value, formula,
            requirements, weight, disadvantage, cost, setState,
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
                        items={armor_types}
                        setState={this.onFieldChange('type')}
                    />
                </ControlGroup>
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={name}
                        setState={this.onFieldChange('name')}
                    />
                </ControlGroup>
                <ControlGroup labels={["AC", ":"]}>
                    <SingleSelect
                        header="Armor method"
                        selected={armor_method}
                        items={this.armor_method}
                        setState={this.onArmorMethod}
                    />
                    {armor_method === 'bonus'
                        ? <InputField
                            type="number"
                            placeholder="Bonus..."
                            value={bonus}
                            setState={this.onFieldChangeDefault(
                                'bonus', undefined
                            )}
                        />
                        : null
                    }
                    {armor_method === 'value'
                        ? <InputField
                            type="number"
                            placeholder="Value..."
                            value={value}
                            setState={this.onFieldChange('value')}
                        />
                        : null
                    }
                    {armor_method === 'formula'
                        ? <InputField
                            placeholder="Formula..."
                            value={formula}
                            setState={this.onFieldChange('formula')}
                        />
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
                        value={requirements.strength || ''}
                        setState={this.onFieldChangeDefault(
                            'requirements', undefined
                        )}
                    />
                </ControlGroup>
                <ControlGroup labels={["Weight", "lb."]}>
                    <InputField
                        type="float"
                        placeholder="Pounds..."
                        value={weight.lb || ''}
                        setState={this.memoize(
                            'weight',
                            (value) => setState({weight: {lb: value}})
                        )}
                    />
                </ControlGroup>
                <ControlGroup label="Stealth">
                    <SingleSelect
                        selected={disadvantage || false}
                        items={this.stealth}
                        setState={this.onFieldChange('disadvantage')}
                    />
                </ControlGroup>
                <ControlGroup label="Value">
                    <CostEditor
                        value={cost}
                        setState={this.onFieldChange('cost')}
                    />
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
                        value={description}
                        rows={5}
                        setState={this.onFieldChange('description')}
                    />
                </ControlGroup>
            </Panel>,
        ];
    }
}

ArmorEdit.defaultProps = {
    name: '',
    bonus: 0,
    value: 0,
    formula: '',
    disadvantage: false,
    armor_types: [],
    description: '',
    requirements: {
        strength: null,
    },
    weight: {
        lb: '',
    },
    cost: {},
};

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
