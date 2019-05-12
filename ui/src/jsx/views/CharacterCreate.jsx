import React from 'react';
import {
    concat,
    isEqual,
} from 'lodash/fp';
import MDReactComponent from 'markdown-react-js';

// import '../../sass/_create-character.scss';

import utils from '../utils.jsx';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import Panel from '../components/Panel.jsx';
import Progress from '../components/Progress.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import TabComponent from '../components/TabComponent.jsx';

import CharacterConfig from '../components/Character/CharacterConfig.jsx';
import {
    ComputeConfig,
} from '../components/Character/ComputeChange.jsx';

import StatisticsSelect from '../components/Character/StatisticsSelect.jsx';
import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper.jsx';

import baseConfig from '../components/Character/baseConfig.json';

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
                    config={ ComputeConfig(races, character) }
                />
                <CharacterConfig
                    config={ ComputeConfig(classes, character) }
                />
                <CharacterConfig
                    config={ ComputeConfig(backgrounds, character) }
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
        ['races', 'classes', 'backgrounds'],
        'character',
    ),
    [
        'genders',
        'alignments',
    ],
    'items'
);