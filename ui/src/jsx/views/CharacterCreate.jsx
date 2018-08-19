import React from 'react';
import _ from 'lodash';
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
import {StatsBlock} from '../components/StatsBlock.jsx';
import TabComponent from '../components/TabComponent.jsx';

import CharacterConfig from '../components/Character/CharacterConfig.jsx';
import StatisticsSelect from '../components/Character/StatisticsSelect.jsx';
import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper.jsx';

const propsList = [
    'alignments',
    'genders',
    'languages',
    'skills',
    'spell',
    'statistics',
    'tools',
    'weapon_types',
    'weapon',
    'armor_types',
    'armor',
    'monster_types',
    'humanoid_types',
    'terrain_types',
];
const propsMap = {
    'armor': '_armor',
    'languages': '_languages',
    'skills': '_skills',
    'spell': '_spells',
    'statistics': '_statistics',
    'weapon': '_weapons',
};

export class CharacterCreate extends React.Component
{
    baseConfig = [{
        type: 'manual',
        path: 'name',
        label: 'Name',
        placeholder: 'Name...',
    }, {
        type: 'select',
        path: 'alignment',
        label: 'Alignment',
        list: ['alignments'],
    }, {
        type: 'select',
        path: 'gender',
        label: 'Gender',
        list: ['genders'],
    }, {
        type: 'config',
        label: 'Personality',
        config: [{
            type: 'manual',
            path: 'personality.traits',
            label: 'Traits',
            placeholder: 'Traits...',
            markup: true,
        }, {
            type: 'manual',
            path: 'personality.ideals',
            label: 'Ideals',
            placeholder: 'Ideals...',
            markup: true,
        }, {
            type: 'manual',
            path: 'personality.bonds',
            label: 'Bonds',
            placeholder: 'Bonds...',
            markup: true,
        }, {
            type: 'manual',
            path: 'personality.flaws',
            label: 'Flaws',
            placeholder: 'Flaws...',
            markup: true,
        }],
    }, {
        type: 'manual',
        path: 'backstory',
        label: 'Backstory',
        placeholder: 'Backstory...',
        markup: true,
    }];

    constructor(props) {
        super(props);
        this.state = {
            tabConfig: [{
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
            }],
        };
    }

    computeConfig(config, character) {
        if (_.isPlainObject(config)) {
            let changed = false;
            const newConfig = _.reduce(
                config,
                (newConfig, value, key) => {
                    newConfig[key] = value;
                    if (key.match(/_formula$/)) {
                        const root = _.replace(key, /_formula$/, '');
                        try {
                            const newValue = utils.resolveMath(
                                character,
                                value,
                                'character'
                            );
                            if (newValue != value) {
                                changed = true;
                                newConfig[root] = newValue;
                            }
                        } catch(error) {
                            if (config[root + '_default'] != value) {
                                changed = true;
                                newConfig[root] = config[root + '_default'];
                            }
                        }
                    } else {
                        const newValue = this.computeConfig(
                            value,
                            character,
                        );
                        if (newValue != value) {
                            changed = true;
                            newConfig[key] = newValue;
                        }
                    }
                    return newConfig;
                },
                {}
            );
            if (changed) {
                return newConfig;
            }
        } else if (_.isObject(config)) {
            let changed = false;
            const newConfig = _.map(
                config,
                value => {
                    const newValue = this.computeConfig(
                        value,
                        character,
                    );
                    if (newValue != value) {
                        changed = true;
                        return newValue;
                    }
                    return value;
                }
            );
            if (changed) {
                return newConfig;
            }
        }

        return config;
    }

    render() {
        const {
            getCurrent,
            races = [], classes = [], backgrounds = [],
            _statistics, setState, genders = [], alignments = [],
        } = this.props;
        const character = getCurrent();
        const {
            race = 'Race',
            'class': _class = 'Class',
            background = 'Background',
            statistics, level = 1, gender, alignment,
            xp_progress = 0, xp_level = 300, name = '',
        } = character;
        const {
            tabConfig,
        } = this.state;

        return <TabComponent
                onTabChange={ this.onTabChange }
                tabConfig={ tabConfig }
                mountAll={ true }
                >
            <CharacterConfig
                config={ this.computeConfig(races, character) }
                />
            <CharacterConfig
                config={ this.computeConfig(classes, character) }
                />
            <CharacterConfig
                config={ this.computeConfig(backgrounds, character) }
                />
            <StatisticsSelect
                budget={ 27 }
                maxBare={ 15 }
                />
            <CharacterConfig
                config={ this.baseConfig }
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
            </Panel>
        </TabComponent>;
    }
}

const foo = {
    className: 'character-create',
    icon: 'fa-user-secret',
    label: 'Create Character',
};

export default ListDataWrapper(
    ListDataWrapper(
        CharacterEditorWrapper(
            CharacterCreate
        ),
        propsList,
        'items',
        propsMap,
    ),
    ['races', 'classes', 'backgrounds'],
    'character',
);