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
    ChoiceSelect,
    ComputeConfig,
    StatisticsSelect,
} from '../components/CharacterConfig';
import store from '../components/CharacterConfig/stores/CharacterEditorStore';

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

    componentWillReceiveProps(props) {
        const { races, classes, backgrounds } = props;
        const { races: oldR, classes: oldC, backgrounds: oldB } = this.props;

        if (
            !races.options
            || !classes.options
            || !backgrounds.options
        ) {
            return null;
        }

        if (
            races === oldR
            && classes === oldC
            && backgrounds === oldB
        ) {
            return null;
        }

        store.setState({
            config: [
                { type: 'choice', uuid: "base-race", ...races },
                { type: 'choice', uuid: "base-class", ...classes },
                { type: 'choice', uuid: "base-background", ...backgrounds },
                { type: 'statistics', uuid: "bare-statistics", editBase: true, budget: 27, minBare: 8, maxBare: 15 },
                { type: 'config', uuid: 'base-description', config: [ ...baseConfig.description, ...baseConfig.personality ]},
            ],
        });
    }

    render() {
        const {
            config: [ races, classes, backgrounds, statistics, description ],
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
        } = {};

        if ( !races || !classes || !backgrounds || !statistics || !description ) {
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
                <StatisticsSelect {...statistics} />
                <CharacterConfig {...description} />
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
    config: {},
    races: {},
    classes: {},
    backgrounds: {},
    genders: [],
    alignments: [],
};

export default ListDataWrapper(
    ListDataWrapper(
        CharacterEditorWrapper(
            CharacterCreate,
            {
                config: true,
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
