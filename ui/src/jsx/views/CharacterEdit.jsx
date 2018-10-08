import React from 'react';
import _ from 'lodash';

import '../../sass/_edit-character.scss';

import BaseViewWrapper from '../hocs/BaseViewWrapper.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import CharacterConfig from '../components/Character/CharacterConfig.jsx';
import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper.jsx';

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

import baseConfig from '../components/Character/baseConfig.json';

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

    onSave = () => {
        const {
            onUpdate,
            history,
        } = this.props;

        onUpdate((id) => history.push(`/character/show/${ id }`));
    }

    render() {
        const {
            character = {},
            config,
            abilityScoreIncrease,
            _statistics,
        } = this.props;

        const {
            name,
            level,
            'class': _class,
            race,
            background,
            xp_progress = 0,
            xp_level = 300,
        } = character;

        return (
            <React.Fragment>

                { !_.isEmpty(config) ? (
                    <Panel
                        key="level-up"
                        className="character-edit__level-up"
                        header="Level Up"
                    >
                        <CharacterConfig
                            key="level-up"
                            config={ config }
                            />
                    </Panel>
                ) : null }

                { abilityScoreIncrease ? (
                    <Panel
                        key="statistics"
                        className="character-edit__statistics"
                        header="Statistics"
                    >
                        <StatisticsSelect
                            editBase={ false }
                            increase={ abilityScoreIncrease }
                            />
                    </Panel>
                ) : null }

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

                    <CharacterConfig
                        config={ baseConfig.description }
                        />

                    <ButtonField
                        label="Save"
                        className="primary"
                        onClick={this.onSave}
                        />

                </Panel>

                <Panel
                    key="personality"
                    className="character-edit__personality"
                    header="Personality"
                >

                    <CharacterConfig
                        config={ baseConfig.personality }
                        />

                </Panel>

            </React.Fragment>
        );
    }
};

export const CharacterEditView = BaseViewWrapper(
    CharacterEdit, viewConfig
);

export default CharacterEditorWrapper(
    CharacterEditView,
    ['character', 'config', 'abilityScoreIncrease'],
);
