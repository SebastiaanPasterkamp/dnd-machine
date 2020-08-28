import React from 'react';
import {
    concat,
    isEqual,
} from 'lodash/fp';
import MDReactComponent from 'markdown-react-js';

// import '../../sass/_create-character.scss';

import utils from '../utils';

import ListDataWrapper from '../hocs/ListDataWrapper';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper';

import ButtonField from '../components/ButtonField';
import ControlGroup from '../components/ControlGroup';
import InputField from '../components/InputField';
import LazyComponent from '../components/LazyComponent';
import ListLabel from '../components/ListLabel';
import MarkdownTextField from '../components/MarkdownTextField';
import Panel from '../components/Panel';
import Progress from '../components/Progress';
import SingleSelect from '../components/SingleSelect';
import TabComponent from '../components/TabComponent';

import CharacterConfig, {
    CharacterEditorWrapper,
    ChoiceSelect,
    ComputeConfig,
    $Select,
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
            character, genders, alignments,
            permanent, features,
        } = this.props;
        const {
            race = 'Race',
            'class': _class = 'Class',
            background = 'Background',
            level = 1,
            xp_progress = 0,
            xp_level = 300,
            name = '',
            gender,
            alignment,
        } = character;

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

                    <h4>
                        Level {level}
                        &nbsp;
                        <ListLabel
                            items={genders}
                            value={gender}
                        />
                        &nbsp;
                        {race}
                        &nbsp;
                        {_class}
                        &nbsp;
                        (<ListLabel
                            items={alignments}
                            value={alignment}
                        />)
                    </h4>

                    <Progress
                        value={xp_progress}
                        total={xp_level}
                        color={"good"}
                        label={`${level} (${xp_progress} / ${xp_level})`}
                    />

                    {permanent ? (
                        <CharacterConfig
                            uuid="58ab8d25-c578-4709-b646-631b1a491f74"
                            type="config"
                            config={permanent}
                        />
                    ) : null}

                    {features ? (
                        <CharacterConfig
                            uuid="3e22f1f8-cf54-4273-ad5c-350a11552951"
                            type="config"
                            config={features}
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
    genders: [],
    alignments: [],
};

export default ListDataWrapper(
    CharacterEditorWrapper(
        CharacterCreate,
        {
            character: true,
            permanent: true,
            features: true,
            races: 'fetch',
            classes: 'fetch',
            backgrounds: 'fetch',
            base: 'fetch',
        },
    ),
    [
        'genders',
        'alignments',
    ],
    'items'
);
