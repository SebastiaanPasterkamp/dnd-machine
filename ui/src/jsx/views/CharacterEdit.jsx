import React from 'react';
import _ from 'lodash';

import '../../sass/_edit-character.scss';

import BaseViewWrapper from '../hocs/BaseViewWrapper.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import {CharacterLevel} from './CharacterLevel.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import StatsBlock from '../components/StatsBlock.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import Progress from '../components/Progress.jsx';

const viewConfig = {
    className: 'character-edit',
    icon: 'fa-user-secret',
    label: 'Character',
    buttons: ['cancel', 'reload', 'save']
};

export class CharacterEdit extends React.Component
{
    onFieldChange(field, value) {
        this.props.setState({
            [field]: value
        });
    }

    render() {
        return [
            <CharacterLevel
                key="level-up"
                {...this.props}
                />
            ,

            <Panel
                    key="description"
                    className="character-edit__description"
                    header="Description"
                >
                Level {this.props.level} {this.props.class} {this.props.race} ({this.props.background})
                <Progress
                    value={this.props.xp_progress}
                    total={this.props.xp_level}
                    color={"good"}
                    labels={[
                        {
                            value: 0.30,
                            label: this.props.xp_progress
                                + " / "
                                + this.props.xp_level
                        },
                        {
                            value: 0.20,
                            label: this.props.xp_progress
                        },
                        {
                            value: 0.10,
                            label: this.props.level
                        }
                    ]}
                    />
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={this.props.name}
                        setState={
                            (value) => this.onFieldChange('name', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Alignment">
                    <SingleSelect
                        emptyLabel="Alignment..."
                        selected={this.props.alignment}
                        items={this.props.alignments}
                        setState={
                            (value) => this.onFieldChange('alignment', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Gender">
                    <SingleSelect
                        emptyLabel="Gender..."
                        selected={this.props.gender}
                        items={this.props.genders}
                        setState={
                            (value) => this.onFieldChange('gender', value)
                        } />
                </ControlGroup>
                <ControlGroup labels={["Height", "ft."]}>
                    <InputField
                        type="float"
                        placeholder="Height..."
                        value={this.props.height}
                        setState={(value) => {
                            this.onFieldChange('height', value);
                        }} />
                </ControlGroup>
                <ControlGroup labels={["Weight", "lb."]}>
                    <InputField
                        type="float"
                        placeholder="Weight..."
                        value={this.props.weight}
                        setState={(value) => {
                            this.onFieldChange('weight', value);
                        }} />
                </ControlGroup>
                <ControlGroup labels={["Age", "years old"]}>
                    <InputField
                        type="number"
                        placeholder="Age..."
                        value={this.props.age}
                        setState={(value) => {
                            value = value || null;
                            this.onFieldChange('age', value);
                        }} />
                </ControlGroup>
                <ControlGroup label="Appearance">
                    <MarkdownTextField
                        placeholder="Appearance..."
                        value={this.props.appearance}
                        rows={5}
                        setState={
                            (value) => this.onFieldChange('appearance', value)
                        } />
                </ControlGroup>
            </Panel>,

            <Panel
                    key="personality"
                    className="character-edit__personality"
                    header="Personality"
                >
                {_.map({
                    'traits': 'Traits',
                    'ideals': 'Ideals',
                    'bonds': 'Bonds',
                    'flaws': 'Flaws'
                }, (label, field) => {
                    return <ControlGroup key={label} label={label}>
                    <MarkdownTextField
                        placeholder={label + "..."}
                        value={this.props[field]}
                        rows={5}
                        setState={
                            (value) => this.onFieldChange(field, value)
                        } />
                </ControlGroup>})}
            </Panel>,

            <Panel
                    key="backstory"
                    className="character-edit__backstory"
                    header="Backstory"
                >
                <MarkdownTextField
                    placeholder="Backstory..."
                    value={this.props.backstory}
                    rows={15}
                    setState={
                        (value) => this.onFieldChange('backstory', value)
                    } />
            </Panel>
        ];
    }
};

export const CharacterEditView = BaseViewWrapper(
    CharacterEdit, viewConfig
);

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        ObjectDataWrapper(
            CharacterEdit,
            [{type: 'character', id: 'id'}]
        ), viewConfig, "character"
    ),
    [
        'alignments',
        'genders',
        'languages',
        'skills',
        'spells',
        'statistics',
        'tools',
        'weapon_types',
        'weapons',
        'armor_types',
        'armor'
    ],
    'items',
    {
        'languages': '_languages',
        'skills': '_skills',
        'spells': '_spells',
        'statistics': '_statistics',
        'weapons': '_weapons',
    }
);
