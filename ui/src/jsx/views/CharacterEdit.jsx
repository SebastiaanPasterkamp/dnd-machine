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
import TagContainer from '../components/TagContainer.jsx';

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
        const {
            level, 'class': _class, race, background, xp_progress, xp_level,
            name, alignment, alignments, gender, genders, height,
            weight, age, appearance, spell, spells, backstory
        } = this.props;

        const isSelectable = (item) => {
            const level = 'level_' + item.level;
            if (!_.includes(item.classes, _class)) {
                return false;
            }
            if (item.level == 'Cantrip') {
                return true;
            }
            if (level in spell.slots && spell.slots[level]) {
                return true;
            }
            return false;
        };

        return <React.Fragment>
            <CharacterLevel
                key="level-up"
                {...this.props}
                />

            <Panel
                    key="description"
                    className="character-edit__description"
                    header="Description"
                >
                Level {level} {_class} {race} ({background})
                <Progress
                    value={xp_progress}
                    total={xp_level}
                    color={"good"}
                    labels={[
                        {
                            value: 0.30,
                            label: xp_progress
                                + " / "
                                + xp_level
                        },
                        {
                            value: 0.20,
                            label: xp_progress
                        },
                        {
                            value: 0.10,
                            label: level
                        }
                    ]}
                    />
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={name}
                        setState={(value) => {
                            this.onFieldChange('name', value);
                        }} />
                </ControlGroup>
                <ControlGroup label="Alignment">
                    <SingleSelect
                        emptyLabel="Alignment..."
                        selected={alignment}
                        items={alignments || []}
                        setState={(value) => {
                            this.onFieldChange('alignment', value);
                        }} />
                </ControlGroup>
                <ControlGroup label="Gender">
                    <SingleSelect
                        emptyLabel="Gender..."
                        selected={gender}
                        items={genders || []}
                        setState={(value) => {
                            this.onFieldChange('gender', value);
                        }} />
                </ControlGroup>
                <ControlGroup labels={["Height", "ft."]}>
                    <InputField
                        type="float"
                        placeholder="Height..."
                        value={height}
                        setState={(value) => {
                            this.onFieldChange('height', value);
                        }} />
                </ControlGroup>
                <ControlGroup labels={["Weight", "lb."]}>
                    <InputField
                        type="float"
                        placeholder="Weight..."
                        value={weight}
                        setState={(value) => {
                            this.onFieldChange('weight', value);
                        }} />
                </ControlGroup>
                <ControlGroup labels={["Age", "years old"]}>
                    <InputField
                        type="number"
                        placeholder="Age..."
                        value={age}
                        setState={(value) => {
                            this.onFieldChange('age', value);
                        }} />
                </ControlGroup>
                <ControlGroup label="Appearance">
                    <MarkdownTextField
                        placeholder="Appearance..."
                        value={appearance}
                        rows={5}
                        setState={(value) => {
                            this.onFieldChange('appearance', value);
                        }} />
                </ControlGroup>
                {spell.max_prepared
                    ? <ControlGroup label="Prepared Spells">
                        <TagContainer
                            tags={spell.list.concat(spell.prepared)}
                            tagOptions={spells || []}
                            setState={(value) => {
                                const prepared = _.difference(
                                    value, spell.list
                                );
                                const update = _.assign(
                                    {}, spell, {prepared}
                                );
                                this.onFieldChange('spell', update);
                            }}
                            showSelect={
                                spell.prepared.length < spell.max_prepared
                            }
                            isSelectable={isSelectable}                            isImmutable={(item) => {
                                return !_.includes(
                                    spell.prepared, item.name
                                );
                            }}
                            />
                    </ControlGroup>
                    : null
                }
            </Panel>

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
                        setState={(value) => {
                            this.onFieldChange(field, value);
                        }} />
                </ControlGroup>})}
            </Panel>

            <Panel
                    key="backstory"
                    className="character-edit__backstory"
                    header="Backstory"
                >
                <MarkdownTextField
                    placeholder="Backstory..."
                    value={backstory}
                    rows={15}
                    setState={(value) => {
                        this.onFieldChange('backstory', value);
                    }} />
            </Panel>
        </React.Fragment>;
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
        'armor': '_armor',
        'languages': '_languages',
        'skills': '_skills',
        'statistics': '_statistics',
        'weapons': '_weapons',
    }
);
