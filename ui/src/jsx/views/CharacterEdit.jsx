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

import {
    CharacterEditorWrapper,
    CharacterConfig,
    ChoiceSelect,
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
    constructor(props) {
        super(props);
        this.onSave = this.onSave.bind(this);
    }

    onSave() {
        const {
            onUpdate,
            history,
        } = this.props;

        onUpdate((id) => history.push(`/character/show/${ id }`));
    }

    render() {
        const {
            races, classes, backgrounds, base,
            character, permanent,
        } = this.props;

        return (
            <React.Fragment>
                {permanent.length ? (
                    <Panel
                        key="permanent"
                        className="character-edit__permanent"
                        header="Permanent configuration options"
                    >
                        <CharacterConfig
                            uuid="58ab8d25-c578-4709-b646-631b1a491f74"
                            type="config"
                            config={permanent}
                        />
                    </Panel>
                ) : null}

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

                    { base.uuid ? (
                        <CharacterConfig {...base} />
                    ) : null}

                    <ButtonField
                        label="Save"
                        className="primary"
                        onClick={this.onSave}
                    />
                </Panel>

                {classes.uuid || races.uuid || backgrounds.uuid ? (
                    <Panel
                        key="level-up"
                        className="character-edit__level-up"
                        header="Level Up"
                    >
                        {races.uuid ? (
                            <ChoiceSelect {...races} />
                        ) : null}

                        {classes.uuid ? (
                            <ChoiceSelect {...classes} />
                        ) : null}

                        {backgrounds.uuid ? (
                            <ChoiceSelect {...backgrounds} />
                        ) : null}
                    </Panel>
                ) : null}


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
    races: {},
    classes: {},
    backgrounds: {},
    character: {},
    base: {},
    permanent: [],
};

export const CharacterEditView = BaseViewWrapper(
    CharacterEdit, viewConfig
);

export default CharacterEditorWrapper(
    CharacterEditView,
    {
        character: true,
        config: true,
        races: 'fetch',
        classes: 'fetch',
        backgrounds: 'fetch',
        base: 'fetch',
    }
);
