import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

// import '../../sass/_create-character.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import {CharacterEditView} from './CharacterEdit.jsx';

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
import ComputeChange from '../components/Character/ComputeChange.jsx';

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

export class CharacterPickAttribute extends LazyComponent
{
    tabConfig(index) {
        const { info, value } = this.props;
        const attrib = info[index];
        const active = _.find(
            attrib.sub || [attrib],
            sub => (sub.name == this.props.value)
        );

        return {
            label: attrib.name,
            color: active
                ? 'good'
                : (value == null ? 'info' : 'accent'),
            active: active
        };
    }

    renderSelector(attrib) {
        const { value, setState } = this.props;
        const subs = _.get(attrib, 'sub');

        if (!subs) {
            return <ButtonField
                label={attrib.name == value ? value : "Pick..."}
                onClick={() => setState(attrib.name)}
                />;
        }

        return <SingleSelect
            items={_.map(subs, (sub) => ({
                code: sub.name,
                label: sub.name
            }))}
            emptyLabel="Pick..."
            selected={value}
            setState={(value) => setState(value)}
            />;
    }

    render() {
        const { info } = this.props;
        if (!info) {
            return null;
        }

        return <TabComponent
            className="character-pick-attribute"
            tabConfig={(index) => this.tabConfig(index)}
            >
            {_.map(info, (attrib, index) => (
                <div key={"attrib-" + index}>
                    {this.renderSelector(attrib)}
                    <MDReactComponent
                        className="character-pick-attribute--description"
                        text={attrib.description}
                        />
                    {this.renderSelector(attrib)}
                </div>
            ))}
        </TabComponent>;
    }
}

export class CharacterCreate extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            doneInit: false,
            doneStats: false,
            doneDescr: false,
            abilityScore: 0,
        };

        this.computeProps = _.debounce(() => {
            const {
                character,
                setState,
            } = this.props;
            const {
                doneInit,
                doneStats,
                doneDescr,
                abilityScore,
                ...change,
            } = this.state;

            const update = ComputeChange(change, {});

            this.setState(
                update.state,
                () => setState(update.props)
            );
        }, 10);
    }

    getCurrent(path) {
        return _.get(
            this.props.character,
            path
        );
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

    onFieldChange(field, value) {
        const {
            character,
            setState,
        } = this.props;
        const {
            race,
            'class': _class,
            background,
        } = character;
        const base = _.assign(
            {},
            {
                race,
                'class': _class,
                background,
            },
            {[field]: value}
        );
        this.setState({
            doneInit: (base.race && base.class && base.background)
        }, () => setState(base));
    }

    onStatisticsChange(value) {
        let statistics = _.assign(
            {},
            this.props.character.statistics,
            value
        );

        this.setState(
            {
                doneStats: (
                    this.state.doneInit
                    && _.sum(_.values(statistics.bare)) >= 60
                )
            },
            () => this.props.setState({ statistics })
        );
    }

    onTabChange(index) {
        this.props.recompute();
        if (index == 5) {
            this.props.setButtons(['save']);
        } else {
            this.props.setButtons([]);
        }
    }

    tabConfig(index) {
        const {
            race, 'class': _class, background
        } = this.props.character;
        const {
            doneInit, doneStats, doneDescr,
        } = this.state;

        const tabs = [
            {
                label: race || 'Race',
                color: race ? 'good' : 'info',
            },
            {
                label: _class || 'Class',
                color: _class ? 'good' : 'info',
            },
            {
                label: background || 'Background',
                color: background ? 'good' : 'info',
            },
            {
                label: 'Statistics',
                color: doneStats ? 'good' : 'info',
                disabled: !doneInit
            },
            {
                label: 'Description',
                color: doneDescr ? 'good' : 'info',
                disabled: !doneStats
            },
            {
                label: 'Result',
                color: 'info',
                disabled: !doneDescr
            }
        ];

        return tabs[index];
    }

    render() {
        const {
            character,
            races = [], classes, backgrounds, _statistics, setState,
            genders = [], alignments = [],
        } = this.props;
        const {
            race, 'class': _class, background, statistics, level,
            gender, alignment, xp_progress, xp_level, name = '',
        } = character;
        const { doneStats } = this.state;

        return <TabComponent
                onTabChange={index => this.onTabChange(index) }
                tabConfig={ index => this.tabConfig(index) }
                mountAll={ true }
                >
            <CharacterConfig
                index={[]}
                config={races}
                getCurrent={path => this.getCurrent(path)}
                getItems={lists => this.getItems(lists)}
                onChange={(path, value, index, option) => {
                    this.onChange(path, value, index, option)
                }}
                />
            <CharacterPickAttribute
                info={classes}
                value={_class}
                setState={
                    (value) => this.onFieldChange('class', value)
                }
                />
            <CharacterPickAttribute
                info={backgrounds}
                value={background}
                setState={
                    (value) => this.onFieldChange('background', value)
                }
                />
            <StatsBlock
                {...statistics}
                budget={27}
                maxBare={15}
                statistics={_statistics}
                setState={
                    (update) => this.onStatisticsChange(update)
                }
                />
            <CharacterEditView
                {...this.props}
                setState={(update) => {
                    this.setState(
                        {
                            doneDescr: (
                                doneStats
                                && name.length
                            )
                        },
                        () => setState(update)
                    );
                }}
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

export default ListDataWrapper(
    ListDataWrapper(
        RoutedObjectDataWrapper(
            CharacterCreate, {
                className: 'character-create',
                icon: 'fa-user-secret',
                label: 'Create Character',
            },
            'character',
            null,
            'character'
        ),
        propsList,
        'items',
        propsMap,
    ),
    ['races', 'classes', 'backgrounds'],
    'character',
);