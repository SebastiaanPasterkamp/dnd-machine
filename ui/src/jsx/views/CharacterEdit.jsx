import React from 'react';
import PropTypes from 'prop-types';
import {
    filter,
    isEmpty,
    map,
} from 'lodash/fp';

import '../../sass/_edit-character.scss';

import BaseViewWrapper from '../hocs/BaseViewWrapper.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import CharacterConfig, {
    baseConfig,
    CharacterEditorWrapper,
} from '../components/CharacterConfig';

import ButtonField from '../components/ButtonField.jsx';
import CharacterLabel from '../components/CharacterLabel.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import StatsBlock from '../components/StatsBlock.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
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
            map((slot, count) => count
                ? slot.replace('level_', '')
                : null
            )(slots)
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

                {max_prepared ? <Panel
                    key="prepared"
                    className="character-edit__prepared"
                    header="Spells Prepared"
                >
                    <CharacterConfig
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
                                    "level": levelFilter
                                }, {
                                    "name": expanded
                                }],
                            },
                            "given": list,
                        }]}
                    />
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
