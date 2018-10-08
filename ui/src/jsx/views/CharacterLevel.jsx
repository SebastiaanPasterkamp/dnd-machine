import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';
import {sprintf} from 'sprintf-js';

import '../../sass/_level-character.scss';

import BaseViewWrapper from '../hocs/BaseViewWrapper.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import Panel from '../components/Panel.jsx';

import CharacterConfig from '../components/Character/CharacterConfig.jsx';
import StatisticsSelect from '../components/Character/StatisticsSelect.jsx';
import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper.jsx';

const viewConfig = {
    className: 'character-level',
    icon: 'fa-level-up',
    label: 'Level-up',
    buttons: ['cancel', 'reload', 'save']
};

const propsList = [
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

export class CharacterLevel extends React.Component
{

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
            character,
            config,
            abilityScoreIncrease,
            _statistics,
        } = this.props;

        if (_.isEmpty(config)) {
            return null;
        }

        const statsBlock = _.isEmpty(character.creation)
            ? {
                editBase: true,
                budget: 27,
                maxBare: 15,
                increase: abilityScoreIncrease,
            } : {
                editBase: false,
                increase: abilityScoreIncrease,
            };

        return [
            <Panel
                key="level-up"
                className="character-level__level-up"
                header="Level-up"
                >
                <CharacterConfig
                    config={ config }
                    />
            </Panel>,

            <StatisticsSelect
                key="statistics"
                {...statsBlock}
                />,
        ];
    }
};

export default CharacterEditorWrapper(
    CharacterLevel,
    ['character', 'config', 'abilityScoreIncrease'],
);
