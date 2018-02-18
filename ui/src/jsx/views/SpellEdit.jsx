import React from 'react';
import _ from 'lodash';

import '../../sass/_spell-edit.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import ControlGroup from '../components/ControlGroup.jsx';
import CostEditor from '../components/CostEditor.jsx';
import DamageEdit from '../components/DamageEdit.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import ReachEdit from '../components/ReachEdit.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import StatsBlock from '../components/StatsBlock.jsx';
import TextField from '../components/TextField.jsx';
import TagContainer from '../components/TagContainer.jsx';

export class SpellEdit extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {};
        this.levels = _.range(0, 11).map((level) => {
            return {
                code: level
                    ? level.toString()
                    : 'Cantrip',
                label: level
                    ? 'Level ' + level
                    : 'Cantrip',
            };
        });
    }

    fixConditionalFields(update={}) {
        const {
            components, cost
        } = _.assign({}, this.props, update);
        let state = {};

        if (_.includes(components, 'material')) {
            if (cost == null) {
                update.cost = this.state.cost || '';
            }
        } else if (cost != null) {
            state.cost = cost;
            update.cost = undefined;
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
            casting_time, classes, _classes, components,
            magic_components, cost, damage, description, duration,
            level, name, range, school, magic_schools
        } = this.props;

        return <React.Fragment>
            <Panel
                    key="properties"
                    className="spell-edit__properties"
                    header="Description"
                >
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={name}
                        setState={(value) =>
                            this.onFieldChange('name', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Level">
                    <SingleSelect
                        selected={level}
                        items={this.levels}
                        setState={(value) =>
                            this.onFieldChange('level', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Classes">
                    <TagContainer
                        tags={classes || []}
                        tagOptions={_classes || []}
                        setState={(value) => {
                            this.onFieldChange('classes', value);
                        }}
                        />
                </ControlGroup>
                <ControlGroup label="School">
                    <SingleSelect
                        selected={school}
                        items={magic_schools || []}
                        setState={(value) =>
                            this.onFieldChange('school', value)
                        } />
                </ControlGroup>
                <ReachEdit
                    distance={range}
                    setState={(range) => {
                        this.onFieldChange('range', range);
                    }}
                    />
                <ControlGroup label="Casting Time">
                    <InputField
                        placeholder="Casting Time..."
                        value={casting_time}
                        setState={(value) =>
                            this.onFieldChange('casting_time', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Duration">
                    <InputField
                        placeholder="Duration..."
                        value={duration}
                        setState={(value) =>
                            this.onFieldChange('duration', value)
                        } />
                </ControlGroup>
                <DamageEdit
                    {...damage}
                    setState={(value) => {
                        this.onFieldChange('damage', value);
                    }}
                    />
                <ControlGroup label="Components">
                    <TagContainer
                        tags={components || []}
                        tagOptions={magic_components || []}
                        setState={(value) => {
                            this.onFieldChange('components', value);
                        }}
                        />
                </ControlGroup>
                {cost != undefined
                    ? <ControlGroup label="Cost">
                        <InputField
                            placeholder="Cost..."
                            value={cost}
                            setState={(value) =>
                                this.onFieldChange('cost', value)
                            } />
                    </ControlGroup>
                    : null
                }
            </Panel>

            <Panel
                    key="description"
                    className="spell-edit__description"
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
            </Panel>
        </React.Fragment>;
    }
};

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        SpellEdit, {
            className: 'spell-edit',
            icon: 'fa-magic',
            label: 'Spell',
            buttons: ['cancel', 'reload', 'save']
        },
        "spell",
        "items",
        {
            "spell": "spells"
        }
    ),
    [
        "magic_components",
        "magic_schools",
        "classes",
    ],
    'items',
    {
        'classes': '_classes'
    }
);
