import React from 'react';
import PropTypes from 'prop-types';
import {
    assign,
    cloneDeep,
    includes,
    isEmpty,
} from 'lodash';

import { memoize } from '../utils';

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
        this.memoize = memoize.bind(this);
    }

    onComponentDidMount() {
        const { setState } = this.props;
        const fix = this.fixConditionalFields();
        if (!isEmpty(fix)) {
            setState(fix);
        }
    }

    fixConditionalFields(update={}) {
        const {
            property, type, range, versatile, damage, description
        } = {...this.props, ...update};
        let state = {};
        if (
            type.match('ranged')
            || includes(property, 'thrown')
        ) {
            if (range === null) {
                update.range = this.state.range || {
                    min: 5,
                    max: 5
                };
            }
        } else if (range !== null) {
            state.range = range;
            update.range = undefined;
        }

        if (includes(property, 'versatile')) {
            if (versatile === null) {
                update.versatile = this.state.versatile || cloneDeep(damage);
            }
        } else if (versatile !== null) {
            state.versatile = versatile;
            update.versatile = undefined;
        }

        if (includes(property, 'special')) {
            if (description === null) {
                update.description = this.state.description || '';
            }
        } else if (description !== null) {
            state.description = description;
            update.description = undefined;
        }

        if (!isEmpty(state)) {
            this.setState(state);
        }
        return update;
    }

    onFieldChange = (field) => {
        const { setState } = this.props;
        return this.memoize(field, (value) => {
            const update = this.fixConditionalFields({
                [field]: value
            });
            setState(update);
        });
    }

    render() {
        const {
            name, damage, versatile, type, weapon_types,
            property, range, weight, cost, description,
            weapon_properties,
        } = this.props;

        return [
            <Panel
                key="description"
                className="weapon-edit__description"
                header="Description"
            >
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={name}
                        setState={this.onFieldChange('name')}
                    />
                </ControlGroup>
                <ControlGroup label="Type">
                    <SingleSelect
                        selected={type}
                        items={weapon_types}
                        setState={this.onFieldChange('type')}
                    />
                </ControlGroup>
                <DamageEdit
                    {...damage}
                    setState={this.onFieldChange('damage')}
                />
                {versatile
                    ? <DamageEdit
                        label="Versatile"
                        {...versatile}
                        setState={this.onFieldChange('versatile')}
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
                        setState={this.onFieldChange('property')}
                    />
                </ControlGroup>
                {range
                    ? <ReachEdit
                        {...range}
                        setState={this.onFieldChange('range')}
                        />
                    : null
                }
                <ControlGroup labels={["Weight", "lb."]}>
                    <InputField
                        type="float"
                        placeholder="Pounds..."
                        value={weight.lb || ''}
                        setState={this.onFieldChange('weight')}
                    />
                </ControlGroup>

                <ControlGroup label="Value">
                    <CostEditor
                        value={cost}
                        setState={this.onFieldChange('cost')}
                    />
                </ControlGroup>
            </Panel>,

            description !== null ? <Panel
                    key="special"
                    className="weapon-edit__special"
                    header="Special"
                >
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={description}
                        rows={5}
                        setState={this.onFieldChange('description')}
                    />
                </ControlGroup>
            </Panel> : null
        ];
    }
}

WeaponEdit.propTypes = {
    property: PropTypes.arrayOf(
        PropTypes.string
    ),
    type: PropTypes.oneOf([
        'simple melee',
        'simple ranged',
        'martial melee',
        'martial ranged',
    ]),
    range: PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number,
    }),
    damage: PropTypes.shape({
        dice_count: PropTypes.number.isRequired,
        dice_size: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
    }).isRequired,
    versatile: PropTypes.shape({
        dice_count: PropTypes.number.isRequired,
        dice_size: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
    }),
    weight: PropTypes.objectOf(
        PropTypes.number
    ),
    cost: PropTypes.objectOf(
        PropTypes.number
    ),
    description: PropTypes.string,
};

WeaponEdit.defaultProps = {
    property: [],
    type: 'simple melee',
    range: null,
    versatile: null,
    damage: {
        dice_count: 1,
        dice_size: 4,
        type: 'piercing',
    },
    cost: {},
    weight: {},
    description: null,
    weapon_types: [],
    weapon_properties: [],
};

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
    ],
    'items'
);
