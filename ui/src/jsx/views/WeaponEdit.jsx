import React from 'react';
import _ from 'lodash';

import '../../sass/_edit-weapon.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import ControlGroup from '../components/ControlGroup.jsx';
import CostEditor from '../components/CostEditor.jsx';
import DamageEdit from '../components/DamageEdit.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import ReachEdit from '../components/ReachEdit.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import TagContainer from '../components/TagContainer.jsx';

export class WeaponEdit extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {};
    }

    onComponentDidMount() {
        let fix = this.fixConditionalFields();
        if (!_.isEmpty(fix)) {
            this.props.setState(fix);
        }
    }

    fixConditionalFields(update={}) {
        const {
            property, type, range, versatile, damage, description
        } = _.assign({}, this.props, update);
        let state = {};
        if (
            type.match('ranged')
            || _.includes(property, 'thrown')
        ) {
            if (range == null) {
                update.range = this.state.range || {
                    min: 5,
                    max: 5
                };
            }
        } else if (range != null) {
            state.range = range;
            update.range = undefined;
        }

        if (_.includes(property, 'versatile')) {
            if (versatile == null) {
                update.versatile = this.state.versatile || _.cloneDeep(damage);
            }
        } else if (versatile != null) {
            state.versatile = versatile;
            update.versatile = undefined;
        }

        if (_.includes(property, 'special')) {
            if (description == null) {
                update.description = this.state.description || '';
            }
        } else if (description != null) {
            state.description = description;
            update.description = undefined;
        }

        if (!_.isEmpty(state)) {
            this.setState(state);
        }
        return update;
    }

    onFieldChange(field, value) {
        const update = this.fixConditionalFields({
            [field]: value
        });
        this.props.setState(update);
    }

    render() {
        const {
            name, damage, versatile, type, weapon_types,
            property = [], range, weight, cost, description,
            weapon_properties = [],
        } = this.props;
        return [
            <Panel
                    key="description"
                    className="weapon-edit__description"
                    header="Description"
                >
                <ControlGroup label="Type">
                    <SingleSelect
                        selected={type || weapon_types[0].code}
                        items={weapon_types || []}
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
                <DamageEdit
                    {...damage}
                    setState={(value) => {
                        this.onFieldChange('damage', value);
                    }}
                    />
                {versatile
                    ? <DamageEdit
                        label="Versatile"
                        {...versatile}
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
                        value={property}
                        items={weapon_properties}
                        setState={(value) => {
                            this.onFieldChange('property', value);
                        }} />
                </ControlGroup>
                {range
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
                        type="float"
                        placeholder="Pounds..."
                        value={weight.lb || ''}
                        setState={(value) => {
                            this.onFieldChange('weight', {lb: value});
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

            description != null ? <Panel
                    key="special"
                    className="weapon-edit__special"
                    header="Special"
                >
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={description}
                        rows={5}
                        setState={(value) => {
                            this.onFieldChange('description', value);
                        }} />
                </ControlGroup>
            </Panel> : null
        ];
    }
}

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        WeaponEdit, {
            className: 'weapon-edit',
            icon: 'fa-cutlery',
            label: 'Weapon',
            buttons: ['cancel', 'reload', 'save']
        },
        "weapon",
        "items"
    ),
    [
        "weapon_types",
        "weapon_properties",
        "damage_types",
    ],
    'items'
);
