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
import TabComponent from '../components/TabComponent.jsx';

import CharacterConfig from '../components/Character/CharacterConfig.jsx';
import StatisticsSelect from '../components/Character/StatisticsSelect.jsx';
import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper.jsx';

import baseConfig from '../components/Character/baseConfig.json';

export class CharacterCreate extends React.Component
{
    constructor(props) {
        super(props);
        this.tabConfig = [{
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

    onSave = () => {
        const {
            onSave,
            history,
        } = this.props;

        onSave((id) => history.push(`/character/show/${ id }`));
    }

    render() {
        const {
            getCurrent,
            races = [], classes = [], backgrounds = [],
            genders = [], alignments = [],
        } = this.props;
        const character = getCurrent();
        const {
            race = 'Race',
            'class': _class = 'Class',
            background = 'Background',
            level = 1, gender, alignment,
            xp_progress = 0, xp_level = 300, name = '',
        } = character;

        return <TabComponent
            tabConfig={ this.tabConfig }
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
                config={ _.concat(
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
        ['races', 'classes', 'backgrounds'],
        'character',
    ),
    [
        'genders',
        'alignments',
    ],
    'items'
);