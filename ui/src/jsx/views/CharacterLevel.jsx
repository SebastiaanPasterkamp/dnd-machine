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

import CharacterConfig from '../components/Character/CharacterConfig.jsx';
import ComputeChange from '../components/Character/ComputeChange.jsx';
import Panel from '../components/Panel.jsx';
import {StatsBlock} from '../components/StatsBlock.jsx';

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
    'armor'
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
    constructor(props) {
        super(props);
        this.state = {
            abilityScore: 0,
        };

        this.computeProps = _.debounce(() => {
            const { character, setState } = this.props;

            const change = ComputeChange(
                this.state,
                character
            );

            if (!_.isEqual(change.state, {})) {
                this.setState(
                    change.state,
                    () => setState(change.props)
                );
            } else {
                setState(change.props);
            }
        }, 10);
    }

    getItems(lists) {
        if (!_.isArray(lists)) {
            lists = [lists];
        }

        return _.reduce(
            lists,
            (items, item) => {
                return items.concat(
                    this.props[
                        propsMap[item] || item
                    ] || []
                );
            },
            []
        );
    }

    onChange(path, value, index, option) {
        this.setState(
            {
                [index.join('.')]: {path, value, option}
            },
            () => this.computeProps()
        );
    }

    render() {
        const {
            character, level_up, statistics, _statistics
        } = this.props;

        if (
            !character
            || !level_up.creation.length
        ) {
            return null;
        }

        let statsBlock = {
            increase: this.state.abilityScore,
            editBase: false,
        };
        if (!character.creation.length) {
            statsBlock.editBase = true;
            statsBlock.budget = 27;
            statsBlock.maxBare = 15;
        }

        return [
            <Panel
                    key="level-up"
                    className="character-level__level-up"
                    header="Level-up"
                >
                <CharacterConfig
                    config={level_up.config}
                    getCurrent={(path) => _.get(this.props, path)}
                    getItems={(lists) => this.getItems(lists)}
                    onChange={(path, value, index, option) => {
                        this.onChange(path, value, index, option)
                    }}
                    />
            </Panel>,

            statsBlock.increase || statsBlock.editBase ? <Panel
                    key="statistics"
                    className="character-level__statistics"
                    header="Ability Score"
                >
                <StatsBlock
                    {...statistics}
                    statistics={_statistics}
                    {...statsBlock}
                    setState={(statistics) => {
                        this.onChange(
                            'statistics.bare',
                            statistics.bare,
                            ['statistics','bare'],
                            {type: 'dict'}
                        );
                        this.onChange(
                            'statistics.base',
                            statistics.base,
                            ['statistics','base'],
                            {type: 'dict'}
                        );
                        this.onChange(
                            'statistics.modifiers',
                            statistics.modifiers,
                            ['statistics','modifiers'],
                            {type: 'dict'}
                        );
                    }}
                    />
            </Panel> : null
        ];
    }
};

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        ObjectDataWrapper(
            CharacterLevel,
            [{type: 'character', id: 'id'}]
        ), viewConfig, "character"
    ),
    propsList,
    'items',
    propsMap
);
