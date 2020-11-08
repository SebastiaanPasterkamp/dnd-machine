import React from 'react';
import {
    concat,
    isEqual,
} from 'lodash/fp';
import MDReactComponent from 'markdown-react-js';

// import '../../sass/_create-character.scss';

import utils from '../utils';

import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper';

import ButtonField from '../components/ButtonField';
import CharacterLabel from '../components/CharacterLabel';
import ControlGroup from '../components/ControlGroup';
import InputField from '../components/InputField';
import ListLabel from '../components/ListLabel';
import MarkdownTextField from '../components/MarkdownTextField';
import Panel from '../components/Panel';
import SingleSelect from '../components/SingleSelect';
import TabComponent from '../components/TabComponent';

import CharacterConfig, {
    CharacterEditorWrapper,
    ChoiceSelect,
} from '../components/CharacterConfig';

export class CharacterCreate extends React.Component
{
    tabConfig = [{
        label: 'Race',
        color: 'info',
    }, {
        label: 'Class',
        color: 'info',
    }, {
        label: 'Background',
        color: 'info',
    }, {
        label: 'Description',
        color: 'info',
    }, {
        label: 'Result',
        color: 'info',
    }];

    constructor(props) {
        super(props);
        this.onSave = this.onSave.bind(this);
    }

    onSave() {
        const {
            onSave,
            history,
        } = this.props;

        onSave((id) => history.push(`/character/show/${ id }`));
    }

    render() {
        const {
            races, classes, backgrounds, base,
            character, permanent, genders, alignments,
        } = this.props;

        if (
            !races.uuid
            || !classes.uuid
            || !backgrounds.uuid
            || !base.uuid
        ) {
            return null;
        }

        return (
            <TabComponent
                tabConfig={ this.tabConfig }
                mountAll={ true }
            >
                <ChoiceSelect {...races} />
                <ChoiceSelect {...classes} />
                <ChoiceSelect {...backgrounds} />
                <CharacterConfig {...base} />
                <Panel
                    header="Result"
                >
                    <h3>{name}</h3>

                    <CharacterLabel
                        characterUpdate={character}
                        showInfo={true}
                        showProgress={true}
                    />

                    {permanent ? (
                        <CharacterConfig
                            uuid="58ab8d25-c578-4709-b646-631b1a491f74"
                            type="config"
                            config={permanent}
                        />
                    ) : null}

                    <ButtonField
                        label="Save"
                        className="primary"
                        onClick={this.onSave}
                    />
                </Panel>
            </TabComponent>
        );
    }
}

CharacterCreate.defaultProps = {
    races: {},
    classes: {},
    backgrounds: {},
    character: {},
    base: {},
};

export default CharacterEditorWrapper(
    CharacterCreate,
    {
        character: true,
        permanent: true,
        races: 'fetch',
        classes: 'fetch',
        backgrounds: 'fetch',
        base: 'fetch',
    },
);
