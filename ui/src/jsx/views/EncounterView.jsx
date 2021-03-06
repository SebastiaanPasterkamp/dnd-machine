import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_encounter-view.scss';

import utils from '../utils';

import ListDataWrapper from '../hocs/ListDataWrapper';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper';
import ReportingActions from '../actions/ReportingActions';
import ListDataActions from '../actions/ListDataActions';

import { BaseLinkButton } from '../components/BaseLinkGroup/index';
import ButtonField from '../components/ButtonField';
import CampaignLabel from '../components/CampaignLabel';
import ControlGroup from '../components/ControlGroup';
import EncounterLinks from '../components/EncounterLinks';
import InputField from '../components/InputField';
import LazyComponent from '../components/LazyComponent';
import MarkdownTextField from '../components/MarkdownTextField';
import MonsterLabel from '../components/MonsterLabel';
import Panel from '../components/Panel';
import Progress from '../components/Progress';
import SingleSelect from '../components/SingleSelect';
import TabComponent from '../components/TabComponent';
import TextField from '../components/TextField';
import UserLabel from '../components/UserLabel';

import MonsterView from './MonsterView';

class CombatantCard extends LazyComponent
{
    constructor(props) {
        super(props);

        const cache = (function(cache) {
            try {
                return JSON.parse(cache);
            } catch (err) {
                return false;
            }
        })(localStorage.getItem(this.getCacheKey()));

        this.state = cache || {
            initiative: 0,
            hp_missing: 0,
            hp_formula: '',
            notes: '',
        };
    }

    getCacheKey() {
        const { prefix, id } = this.props;
        return ['CombatantCard', prefix, id].join('-');
    }

    updateState(update) {
        this.setState(
            update,
            () => localStorage.setItem(
                this.getCacheKey(),
                JSON.stringify(this.state)
            )
        );
    }

    updateHP(hp_formula) {
        if (hp_formula == this.state.hp_formula) {
            return;
        }
        if (hp_formula == '') {
            this.updateState({hp_formula, hp_missing: 0});
        }
        if (hp_formula.match(/^[0-9]+(\s?[+-]\s?[0-9]+)*(\s?[+-]\s?|\s)$/)) {
            this.updateState({hp_formula});
            return;
        }
        if (!hp_formula.match(/^[0-9]+(\s?[+-]\s?[0-9]+)*$/)) {
            return;
        }

        const { hit_points } = this.props;
        const calc = {
            '+': (a, b) => Math.min(hit_points, a + b),
            '-': (a, b) => Math.max(0, a - b),
        };
        const formula = hp_formula
            .replace(/\s+/, '')
            .split(/\b/);
        const hp_missing = _.reduce(
            _.range(1, formula.length-1, 2),
            (hp_missing, i) => {
                return calc[ formula[i] ](
                    hp_missing,
                    parseInt(formula[i+1])
                );
            },
            Math.min(hit_points, Math.max(0, parseInt(formula[0])))
        );
        this.updateState({hp_formula, hp_missing});
    }

    render() {
        const {
            name, hit_points, armor_class, spell,
            defaultStyle, combat
        } = this.props;
        const {
            initiative, hp_missing, hp_formula, notes
        } = this.state;
        const style = utils.makeStyle({
            [defaultStyle]: hp_missing < hit_points,
            'bad': hp_missing >= hit_points,
        }, ["nice-card"]);

        return <summary
            className={style}
            style={combat ? {order: -(initiative || 0)} : null}
            >
            <div className="nice-card-title">
                <h3>{name}</h3>
            </div>
            <div className="nice-card-content">
                <Progress
                    value={hit_points - hp_missing}
                    total={hit_points}
                    color={utils.closest({
                        "muted": -0.15,
                        "bad": 0.15,
                        "warning": 0.50,
                        "good": 0.85,
                    }, 1.0 - (hp_missing / hit_points), 'muted')}
                    label={
                        (hit_points - hp_missing)
                        + ' / '
                        + hit_points
                    }
                    />
                <strong>AC:</strong>&nbsp;{armor_class}
                {spell
                    ? <React.Fragment>
                        <strong>Spell DC:</strong>&nbsp;
                        {spell.safe_dc}
                    </React.Fragment>
                    : null
                }
            </div>
            {!combat ? <div className="nice-card-sub">
                <InputField
                    placeholder="Initiative..."
                    type="number"
                    value={initiative || ''}
                    setState={(initiative) => this.updateState({initiative})}
                    />
            </div> : null}
            {combat ? <div className="nice-card-sub">
                <InputField
                    placeholder="Damage taken..."
                    value={hp_formula}
                    setState={(value) => this.updateHP(value)}
                    />
                <TextField
                    placeholder="Notes..."
                    value={notes}
                    setState={(notes) => this.updateState({notes})}
                    />
            </div> : null}
        </summary>;
    }
}

export class EncounterView extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            combat: false
        };
    }

    awardXP = () => {
        const { xp, hosted_party: { id, size } = {} } = this.props;

        fetch(
            `/party/xp/${id}/${xp}`,
            {
                method: "POST",
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                ListDataActions.fetchItems.completed({
                    hosted_party: data,
                });
                ReportingActions.showMessage(
                    'info',
                    `${Math.round(xp / size)} XP Awarded`
                );
            });
    }

    toggleCombat = () => {
        this.setState({
            combat: !this.state.combat
        });
    }

    render() {
        const {
            id, name, description, size, monster_ids, campaign_id,
            hosted_party, monsters, characters,
            challenge_rating, xp, xp_rating, modifier, xp_modified,
            challenge_modified, combatants, alignments,
            size_hit_dice, monster_types, _languages,
        } = this.props;
        const { combat } = this.state;

        if (!name) {
            return null;
        }

        const {
            id: partyId,
            name: partyName,
            size: partySize,
            challenge = {},
        } = hosted_party || {};

        const classification = partyId !== undefined
            ? utils.closest({
                'info': challenge.easy,
                'good': challenge.medium,
                'warning': challenge.hard,
                'bad': challenge.deadly
            }, xp, 'info')
            : null;
        const monsterProps = {
            alignments, size_hit_dice, monster_types, _languages
        };
        const trackerStyle = utils.makeStyle({
            'warning': !combat,
            'bad': combat
        }, ["encounter-view__tracker"]);

        return <React.Fragment>
            <Panel
                key="description"
                className="encounter-view__description info"
                header="Description"
                >
                <thead>
                    <tr>
                        <th colSpan="2">
                            <EncounterLinks
                                id={id}
                                className="pull-right"
                            >
                                <BaseLinkButton
                                    label="Award XP"
                                    className="good"
                                    icon="trophy"
                                    action={this.awardXP}
                                    available={!!partyId}
                                />
                            </EncounterLinks>
                            <h3>{name}</h3>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {campaign_id ? (
                        <tr>
                            <th>Campaign</th>
                            <td>
                                <CampaignLabel id={campaign_id} />
                            </td>
                        </tr>
                    ) : null}
                    <tr>
                        <th>Description</th>
                        <td>
                            <MDReactComponent
                                text={description}
                                />
                        </td>
                    </tr>
                </tbody>
            </Panel>

            {partyId ? <Panel
                key="challenge"
                className="encounter-view__challenge info"
                header="Party Encounter Challenge Rating"
                >
                <thead>
                    <tr>
                        <th>Party name</th>
                        <th>Party size</th>
                        <th className="info">Easy</th>
                        <th className="good">Medium</th>
                        <th className="warning">Hard</th>
                        <th className="bad">Deadly</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{partyName}</td>
                        <td>{partySize}</td>
                        <td className="info">
                            {challenge.easy}XP
                        </td>
                        <td className="good">
                            {challenge.medium}XP
                        </td>
                        <td className="warning">
                            {challenge.hard}XP
                        </td>
                        <td className="bad">
                            {challenge.deadly}XP
                        </td>
                    </tr>
                </tbody>
            </Panel> : null }

            <Panel
                key="monsters"
                className="encounter-view__modified info"
                header="Modified Encounter Challenge Rating"
                >
                <thead>
                    <tr>
                        <th>Encounter Rating</th>
                        <th>Monster Modifier</th>
                        <th>Party Modifier</th>
                        <th>Final Modifier</th>
                        <th>Modified Encounter Rating</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>
                            CR {challenge_rating.toFixed(2)}
                            &nbsp;/&nbsp;
                            {xp_rating} XP
                        </td>
                        <td>{modifier.monster}</td>
                        <td>{modifier.party}</td>
                        <td>{modifier.total}</td>
                        <td className={classification}>
                            CR {challenge_modified}
                            &nbsp;/&nbsp;
                            {xp_modified} XP
                        </td>
                    </tr>
                </tbody>
            </Panel>

            {hosted_party ? <Panel
                className={trackerStyle}
                header={combat ? "Combat" : "Initiative"}
                >

                <div className="encounter-view__tracker-cards">
                {_.map(
                    hosted_party.member_ids,
                    (character_id, index) => {
                        if (!(character_id in characters)) {
                            return null;
                        }

                        return <CombatantCard
                            key={`character-${character_id}`}
                            {...characters[character_id]}
                            defaultStyle="info"
                            prefix={`${id}-character`}
                            combat={combat}
                            />;
                    }
                )}

                {_.map(
                    monster_ids,
                    monster => {
                        if (!(monster.id in monsters)) {
                            return null;
                        }

                        return _.map(
                            _.range(0, monster.count),
                            index => (
                                <CombatantCard
                                    key={`monster-${monster.id}-${index}`}
                                    {...monsters[monster.id]}
                                    defaultStyle="brand"
                                    prefix={`${id}-monster-${index}`}
                                    combat={combat}
                                    />
                            )
                        );
                    }
                )}
                </div>

                {combat
                    ? <button
                        className="nice-btn pull-right icon fa-random accent"
                        onClick={this.toggleCombat}
                        >
                        Initiative
                    </button>
                    : <button
                        className="nice-btn pull-right icon fa-gamepad warning"
                        onClick={this.toggleCombat}
                        >
                        Combat
                    </button>
                }

            </Panel> : null }

            {monsters ? <TabComponent
                className="encounter-view__monsters"
                tabConfig={_.map(monster_ids, monster => ({
                    label: monster.id in monsters
                        ? monsters[monster.id].name
                        : 'Unknown'
                }))}
                >
                {_.map(monster_ids, monster => (
                    monster.id in monsters
                        ? <MonsterView
                            key={monster.id}
                            {...monsters[monster.id]}
                            {...monsterProps}
                            name={
                                monsters[monster.id].name
                                + ' x '
                                + monster.count
                            }
                            />
                        : null
                ))}
            </TabComponent> : null }
        </React.Fragment>;
    }
}

EncounterView.defaultProps = {
    campaign_id: null,
    name: '',
    description: '',
    size: 0,
    monster_ids: [],
    hosted_party: null,
    monsters: {},
    characters: {},
    challenge_rating: 0,
    xp: 0,
    xp_rating: 0,
    xp_modified: 0,
    modifier: 0,
    challenge_modified: 0,
    combatants: [],
    alignments: [],
    size_hit_dice: [],
    monster_types: [],
    _languages: [],
};

export default ListDataWrapper(
    ListDataWrapper(
        ObjectDataListWrapper(
            RoutedObjectDataWrapper(
                EncounterView,
                {
                    className: 'encounter-view',
                    icon: 'fa-gamepad',
                    label: 'Encounter',
                },
                "encounter"
            ),
            {
                monsters: {type: 'monster'},
                characters: {type: 'character'},
            }
        ),
        ['alignments', 'size_hit_dice', 'monster_types', 'languages'],
        'items',
        {'languages': '_languages'}
    ),
    ['hosted_party']
);
