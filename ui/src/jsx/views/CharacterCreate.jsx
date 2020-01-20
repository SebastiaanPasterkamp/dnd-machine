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
    baseConfig,
    CharacterEditorWrapper,
    ComputeConfig,
    StatisticsSelect,
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
        label: 'Statistics',
        color: 'info',
    }, {
        label: 'Description',
        color: 'info',
    }, {
        label: 'Result',
        color: 'info',
    }];

    onSave = () => {
        const {
            onSave,
            history,
        } = this.props;

        onSave((id) => history.push(`/character/show/${ id }`));
    }

    render() {
        const {
            character,
            races, classes, backgrounds,
            genders, alignments,
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

        return (
            <TabComponent
                tabConfig={ this.tabConfig }
                mountAll={ true }
            >
                <CharacterConfig
                    config={ ComputeConfig([{
                        type: "choice",
                        options: races,
                    }], character) }
                />
                <CharacterConfig
                    config={ ComputeConfig([{
                        type: "choice",
                        options: classes,
                    }], character) }
                />
                <CharacterConfig
                    config={ ComputeConfig([{
                        type: "choice",
                        options: backgrounds,
                    }], character) }
                />
                <StatisticsSelect
                    editBase={true}
                    budget={ 27 }
                    minBare={ 8 }
                    maxBare={ 15 }
                />
                <CharacterConfig
                    config={ concat(
                        baseConfig.description,
                        baseConfig.personality,
                    ) }
                />
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
    character: {},
    races: [],
    classes: [],
    backgrounds: [],
    genders: [],
    alignments: [],
};

export default ListDataWrapper(
    ListDataWrapper(
        CharacterEditorWrapper(
            CharacterCreate,
            {
                character: true,
            }
        ),
        ['race', 'class', 'background'],
        'data',
        {
            race: 'races',
            class: 'classes',
            background: 'backgrounds',
        }
    ),
    [
        'genders',
        'alignments',
    ],
    'items'
);
