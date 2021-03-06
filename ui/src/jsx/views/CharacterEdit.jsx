import React from 'react';
import PropTypes from 'prop-types';
import {
    entries,
    filter,
    flow,
    isEmpty,
    map,
} from 'lodash/fp';

import '../../sass/_edit-character.scss';

import BaseViewWrapper from '../hocs/BaseViewWrapper';
import ListDataWrapper from '../hocs/ListDataWrapper';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper';

import CharacterConfig, {
    baseConfig,
    CharacterEditorWrapper,
} from '../components/CharacterConfig';

import ButtonField from '../components/ButtonField';
import CharacterLabel from '../components/CharacterLabel';
import ControlGroup from '../components/ControlGroup';
import InputField from '../components/InputField';
import Panel from '../components/Panel';
import MultiSelect from '../components/MultiSelect';
import SingleSelect from '../components/SingleSelect';
import StatsBlock from '../components/StatsBlock';
import MarkdownTextField from '../components/MarkdownTextField';
import TagContainer from '../components/TagContainer';

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
        const { character, config } = this.props;
        const {
            spell: {
                max_prepared = 0,
                prepared = [],
                cantrips = [],
                list = [],
                expanded = [],
                slots = {},
            } = {},
            'class': _class,
        } = character;
        const levelFilter = filter(
            null,
            flow(entries, map(([slot, count]) => count
                ? slot.replace('level_', '')
                : null
            ))(slots)
        );

        return (
            <React.Fragment>
                { !isEmpty(config) ? (
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

                <Panel
                    key="description"
                    className="character-edit__description"
                    header="Description"
                >
                    <CharacterLabel
                        characterUpdate={character}
                        showInfo={true}
                        showProgress={true}
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

                {max_prepared || list.length || cantrips.length ? <Panel
                    key="prepared"
                    className="character-edit__prepared"
                    header="Spells Prepared"
                >
                    {max_prepared ? <CharacterConfig
                        config={[{
                            "label": "Prepared spells",
                            "path": "spell.prepared",
                            "type": "list",
                            "list": ["spell"],
                            "limit": max_prepared,
                            "replace": max_prepared,
                            "filter": {
                                "or": [{
                                    "classes": _class,
                                    "level": levelFilter,
                                }, {
                                    "name": expanded,
                                }],
                                "not": {
                                    "name": list,
                                },
                            },
                        }]}
                    /> : null }
                    {cantrips.length ? <CharacterConfig
                        config={[{
                            "label": "Known cantrips",
                            "path": "spell.cantrips",
                            "type": "list",
                            "list": ["spell"],
                        }]}
                    /> : null}
                    {list.length ? <CharacterConfig
                        config={[{
                            "label": "Known spells",
                            "path": "spell.list",
                            "type": "list",
                            "list": ["spell"],
                        }]}
                    /> : null }
                </Panel> : null}

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

CharacterEdit.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    character: PropTypes.object,
    config: PropTypes.arrayOf(
        PropTypes.object
    ),
};

CharacterEdit.defaultProps = {
    character: {},
    config: [],
};

export const CharacterEditView = BaseViewWrapper(
    CharacterEdit, viewConfig
);

export default CharacterEditorWrapper(
    CharacterEditView,
    {
        character: true,
        config: true,
    }
);
