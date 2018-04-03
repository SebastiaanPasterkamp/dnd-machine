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
            const change = _.reduce(
                this.state,
                (change, {path, value, option}) => {
                    if (_.isNil(option)) {
                        return change;
                    }

                    if (option.type == 'ability_score') {
                        change.state.abilityScore = (
                            change.state.abilityScore || 0
                        ) + (value || 0);
                        return change;
                    }

                    const root = _.split(path, '.')[0];
                    if (_.isNil(change.props[root])) {
                        change.props[root] = _.cloneDeep(
                            this.props.character[root]
                        );
                    }
                    if (value == undefined) {
                        return change;
                    }

                    const current = _.get(
                        change.props,
                        path
                    );
                    let update = null;

                    if (
                        value == null
                        || _.includes(
                            ['value', 'select'],
                            option.type
                        )
                    ) {
                        update = value;
                    } else if (option.type == 'dict') {
                        update = _.assign(
                            {},
                            current || {},
                            value
                        );
                    } else if (option.type == 'list') {
                        update = (current || []).concat(
                            value
                        );
                        if (!(option.multiple || false)) {
                            update = _.uniq(update);
                        }
                    } else {
                        console.log([
                            "Unknown option type",
                            option
                        ]);
                    }

                    change.props = _.set(
                        change.props,
                        path,
                        update
                    );

                    return change;
                },
                {props: {}, state: {}}
            );

            if (!_.isEqual(change.state, {})) {
                this.setState(
                    change.state,
                    () => {
                        this.props.setState(change.props);
                    }
                );
            } else {
                this.props.setState(change.props);
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
                    index={[]}
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
