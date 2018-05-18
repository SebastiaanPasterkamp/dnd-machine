import React from 'react';
import _ from 'lodash';

import '../../sass/_encounter-edit.scss';

import utils from '../utils.jsx';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataActions from '../actions/ObjectDataActions.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import Bonus from '../components/Bonus.jsx';
import ButtonField from '../components/ButtonField.jsx';
import ChallengeRating from '../components/ChallengeRating.jsx';
import MonsterLabel from '../components/MonsterLabel.jsx';
import MonsterLinks from '../components/MonsterLinks.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import XpRating from '../components/XpRating.jsx';

import ModalDialog from '../components/ModalDialog.jsx';

export class EncounterEdit extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            dialog: false
        };
    }

    toggleDialog() {
        this.setState({
            dialog: !this.state.dialog
        });
    }

    onFieldChange(field, value) {
        this.props.setState({
            [field]: value
        });
    }

    onRemoveMonsterButton(id) {
        const {
            monster_ids, setState, recompute
        } = this.props;
        const index = _.findIndex(monster_ids, {id});

        if (
            index < 0
            || monster_ids[index].count <= 0
        ) {
            return;
        }

        const monster = _.assign(
            {},
            monster_ids[index],
            {count: monster_ids[index].count - 1}
        );
        const update = _.concat(
            _.slice(monster_ids, 0, index),
            monster.count ? [monster] : [],
            _.slice(monster_ids, index+1)
        );

        setState(
            {monster_ids: update},
            () => recompute()
        );
    }

    onAddMonsterButton(id) {
        const {
            monster_ids = [], setState, recompute
        } = this.props;
        const index = _.findIndex(monster_ids, {id});
        let update = monster_ids;

        if (index < 0) {
            const monster = {id, count: 1};
            update = _.concat(
                monster_ids,
                [monster]
            );
        } else {
            const monster = _.assign(
                {},
                monster_ids[index],
                {count: monster_ids[index].count + 1}
            );
            update = _.concat(
                _.slice(monster_ids, 0, index),
                [monster],
                _.slice(monster_ids, index+1)
            );
        }

        setState(
            {monster_ids: update},
            () => recompute()
        );
    }

    renderDialog() {
        if (!this.state.dialog) {
            return null;
        }

        const {
            monsters, monster_ids, reload
        } = this.props;

        const filtered = _.filter(
            monsters,
            monster => !_.find(monster_ids, {id: monster.id})
        );

        return <ModalDialog
            key="dialog"
            label="Add monsters"
            onCancel={() => reload(() => this.toggleDialog())}
            onDone={() => this.toggleDialog()}
            >
            <table className="nice-table condensed bordered">
                <thead>
                    <tr>
                        <th>Monster</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>{_.map(filtered, monster => (
                    <tr key={monster.id}>
                        <td>
                            <MonsterLabel
                                monster_id={monster.id}
                                />
                        </td>
                        <td>
                            <a
                                className="nice-btn-alt cursor-pointer icon fa-plus"
                                onClick={() => this.onAddMonsterButton(monster.id)}
                                >
                                Add
                            </a>
                        </td>
                    </tr>
                ))}</tbody>
            </table>
        </ModalDialog>;
    }

    render() {
        const {
            id, name, description = '', size, monster_ids = [], monsters = {},
            modifier = {}, challenge_rating, challenge_modified,
            challenge_rating_precise, xp, xp_modified, xp_rating, hosted_party
        } = this.props;

        const { challenge } = hosted_party || {};
        const index = challenge ? utils.closest({
            'irrelevant': 0,
            'easy': challenge.easy,
            'medium': challenge.medium,
            'hard': challenge.hard,
            'deadly': challenge.deadly,
            'insane': challenge.deadly + (
                    challenge.deadly
                    - challenge.hard
                )
        }, xp_rating || 0, 'irrelevant') : null;
        const classification = challenge ? {
            'irrelevant': <span>
                Irrelevant
                (&lt; <XpRating xpRating={challenge.easy} />)
            </span>,
            'easy': <span>
                Easy
                (<XpRating xpRating={challenge.easy} />)
            </span>,
            'medium': <span>
                Medium
                (<XpRating xpRating={challenge.medium} />)
            </span>,
            'hard': <span>
                Hard
                (<XpRating xpRating={challenge.hard} />)
            </span>,
            'deadly': <span>
                Deadly
                (<XpRating xpRating={challenge.deadly} />)
            </span>,
            'insane': <span>
                Insane
                (&gt; <XpRating xpRating={challenge.deadly} />)
            </span>,
        }[index] : null;
        const summary = _.reduce(
            monster_ids, (summary, m) => {
                if (!m) {
                    return summary;
                }
                const monster = _.get(monsters, m.id);
                if (!monster) {
                    return summary;
                }

                summary.challenge_rating += monster.challenge_rating_precise * m.count;
                summary.xp += monster.xp_rating * m.count;
                summary.average_damage += monster.average_damage * m.count;

                return summary;
            },
            {
                challenge_rating: 0,
                xp: 0,
                average_damage: 0,
            }
        );

        return <React.Fragment>
            <Panel
                key="description"
                className="encounter-edit__description"
                header="Description"
                >
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={name}
                        setState={
                            (value) => this.onFieldChange('name', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={description}
                        rows={5}
                        setState={
                            (value) => this.onFieldChange('description', value)
                        } />
                </ControlGroup>
            </Panel>

            <Panel
                key="challenge"
                className="encounter-edit__challenge"
                header="Challenge Rating Overview"
                >
                <tbody>
                    <tr>
                        <th>Monster Modifier</th>
                        <th>Party Modifier</th>
                        <th>Final Modifier</th>
                    </tr>
                    <tr>
                        <td>{modifier.monster}</td>
                        <td>{modifier.party}</td>
                        <td>{modifier.total}</td>
                    </tr>
                    <tr>
                        <th>Challenge Rating</th>
                        <th>Modified for party</th>
                        <th>Exact Challenge Rating</th>
                    </tr>
                    <tr>
                        <td>
                            <ChallengeRating
                                challengeRating={challenge_rating}
                                />
                            &nbsp;/&nbsp;
                            <XpRating
                                xpRating={xp}
                                />
                        </td>
                        {challenge
                            ? <td>
                                <ChallengeRating
                                    challengeRating={challenge_modified}
                                    />
                                &nbsp;/&nbsp;
                                <XpRating
                                    xpRating={xp_modified}
                                    />
                            </td>
                            : <td>&mdash;</td>
                        }
                        <td>
                            <ChallengeRating
                                challengeRating={challenge_rating_precise}
                                precise={true}
                                />
                            &nbsp;/&nbsp;
                            <XpRating
                                xpRating={xp_rating}
                                precise={true}
                                />
                        </td>
                    </tr>
                    {hosted_party ? <React.Fragment>
                        <tr>
                            <th>Party Size</th>
                            <th>XP / Party Member</th>
                            <th>Challenge Classification</th>
                        </tr>
                        <tr>
                            <td>{hosted_party.size}</td>
                            <td>
                                <XpRating
                                    xpRating={(xp || 0) / hosted_party.size}
                                    />
                            </td>
                            <td>{classification}</td>
                        </tr>
                    </React.Fragment> : null}
                </tbody>
            </Panel>

            <Panel
                key="monsters"
                className="encounter-edit__monsters"
                header="Encounter Monsters"
                >
                <thead>
                    <tr>
                        <th rowSpan="2">Monster Name</th>
                        <th colSpan="2">Monster Stats</th>
                        <th colSpan="2">Defensive</th>
                        <th colSpan="2">Offensive</th>
                    </tr>
                    <tr>
                        <th>Challenge Rating</th>
                        <th>Challenge XP</th>
                        <th>Hit Points</th>
                        <th>Armor Class</th>
                        <th>Damage / Round</th>
                        <th>Attack Bonus / Spell Save DC</th>
                    </tr>
                </thead>
                <tbody>{_.map(monster_ids, m => {
                    if (!m) {
                        return null;
                    }
                    const monster = _.get(monsters, m.id);
                    if (!monster) {
                        return null;
                    }

                    return <tr key={m.id}>
                        <th>
                            {m.count} x {monster.name}
                            <MonsterLinks
                                altStyle={true}
                                buttons={['view']}
                                monster_id={monster.id}
                                extra={{
                                    remove: {
                                        action: () => {
                                            this.onRemoveMonsterButton(monster.id);
                                        },
                                        icon: 'minus',
                                        className: 'warning'
                                    },
                                    add: {
                                        action: () => {
                                            this.onAddMonsterButton(monster.id);
                                        },
                                        icon: 'plus',
                                        className: 'good'
                                    },
                                }}
                                />
                        </th>
                        <td>
                            <ChallengeRating
                                challengeRating={monster.challenge_rating_precise}
                                precise={true}
                                />
                            {m.count > 1 ? <span>(
                                <ChallengeRating
                                    challengeRating={
                                        monster.challenge_rating_precise
                                        * m.count
                                    }
                                    precise={true}
                                    />
                             )</span> : null}
                        </td>
                        <td>
                            <XpRating
                                xpRating={monster.xp_rating}
                                />
                            {m.count > 1 ? <span>(
                                <XpRating
                                    xpRating={
                                        monster.xp_rating
                                        * m.count
                                    }
                                    />
                             )</span> : null}
                        </td>
                        <td>{monster.hit_points}</td>
                        <td>{monster.armor_class}</td>
                        <td>
                            {monster.average_damage}
                            {m.count > 1 ? <span>(
                                {monster.average_damage * m.count}
                             )</span> : null}
                        </td>
                        <td>
                            {monster.attack_bonus
                                ? <span>
                                    Hit&nbsp;
                                    <Bonus
                                        bonus={monster.attack_bonus}
                                        />
                                </span>
                                : null
                            }
                            {monster.spell_save_dc
                                ? <span>
                                    DC &ge; {monster.spell_save_dc}
                                </span>
                                : null
                            }
                        </td>
                    </tr>;
                })}</tbody>
                <tbody>
                    <tr>
                        <th>
                            <a
                                className="nice-btn-alt cursor-pointer icon fa-plus"
                                onClick={() => this.toggleDialog()}
                                >
                                Add
                            </a>
                        </th>
                        <td>
                            <ChallengeRating
                                challengeRating={summary.challenge_rating}
                                precise={true}
                                />
                        </td>
                        <td>
                            <XpRating
                                xpRating={summary.xp}
                                precise={true}
                                />
                        </td>
                        <td colSpan="2"></td>
                        <td>
                            {summary.average_damage}
                        </td>
                        <td></td>
                    </tr>
                </tbody>
            </Panel>

            {this.renderDialog()}
        </React.Fragment>;
    }
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        RoutedObjectDataWrapper(
            EncounterEdit,
            {
                className: 'encounter-edit',
                icon: 'fa-game',
                label: 'Encounter',
                buttons: ['cancel', 'reload', 'recompute', 'save']
            },
            "encounter"
        ),
        {monsters: {type: 'monster'}}
    ),
    ['hosted_party']
);
