import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_encounter-edit.scss';

import utils, { memoize } from '../utils';

import ListDataWrapper from '../hocs/ListDataWrapper';
import ObjectDataActions from '../actions/ObjectDataActions';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper';

import { BaseLinkButton } from '../components/BaseLinkGroup/index';
import Bonus from '../components/Bonus';
import ButtonField from '../components/ButtonField';
import ChallengeRating from '../components/ChallengeRating';
import MonsterLabel from '../components/MonsterLabel';
import MonsterLinks from '../components/MonsterLinks';
import { MonsterPicker } from '../components/MonsterPicker';
import ControlGroup from '../components/ControlGroup';
import InputField from '../components/InputField';
import Panel from '../components/Panel';
import SingleSelect from '../components/SingleSelect';
import MarkdownTextField from '../components/MarkdownTextField';
import XpRating from '../components/XpRating';

const EncounterRating = ({ encounter, party }) => {
    if (!encounter || !party) {
        return null;
    }

    const {
        easy = 0,
        medium = 0,
        hard = 0,
        deadly = 0,
    } = party;

    const rating = utils.closest({
        irrelevant: 0,
        easy, medium, hard, deadly,
        insane: deadly + deadly - hard,
    }, encounter, 'irrelevant');

    if (rating === 'easy') {
        return (
            <span>
                Easy
                (<XpRating xpRating={easy} />)
            </span>
        );
    }
    if (rating === 'medium') {
        return (
            <span>
                Medium
                (<XpRating xpRating={medium} />)
            </span>
        );
    }
    if (rating === 'hard') {
        return (
            <span>
                Hard
                (<XpRating xpRating={hard} />)
            </span>
        );
    }
    if (rating === 'deadly') {
        return (
            <span>
                Deadly
                (<XpRating xpRating={deadly} />)
            </span>
        );
    }
    if (rating === 'insane') {
        return (
            <span>
                Insane
                (&gt; <XpRating xpRating={deadly} />)
            </span>
        );
    }
    return (
        <span>
            Irrelevant
            (&lt; <XpRating xpRating={easy} />)
        </span>
    );
};

export class EncounterEdit extends React.Component
{
    monsterLinks = ['view'];

    constructor(props) {
        super(props);
        this.state = {
            dialog: false,
        };
        this.memoize = memoize.bind(this);
    }

    onMonsterFilter = ({ id }) => {
        const { monster_ids } = this.props;

        return !_.find(monster_ids, {id});
    }

    onAddMonster = (id) => {
        const { monster_ids, setState, recompute } = this.props;
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

    toggleDialog = () => {
        this.setState({
            dialog: !this.state.dialog
        });
    }

    onFieldChange = (field) => this.memoize(
        field,
        (value) => this.props.setState({
            [field]: value,
        })
    );

    onRemoveMonsterButton = (id) => this.memoize(`dec-${id}`, () => {
        const { monster_ids, setState, recompute } = this.props;
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
    })

    onAddMonsterButton = (id) => this.memoize(
        `inc-${id}`,
        () => this.onAddMonster(id)
    )

    render() {
        const { dialog } = this.state;
        const {
            id, name, description, size, monster_ids,
            monsters, modifier, challenge_rating,
            challenge_modified, challenge_rating_precise,
            xp, xp_modified, xp_rating, hosted_party,
        } = this.props;

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
                        setState={this.onFieldChange('name')}
                    />
                </ControlGroup>
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={description}
                        rows={5}
                        setState={this.onFieldChange('description')}
                    />
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
                        {hosted_party.size ? (
                            <td>
                                <ChallengeRating
                                    challengeRating={challenge_modified}
                                />
                                &nbsp;/&nbsp;
                                <XpRating
                                    xpRating={xp_modified}
                                />
                            </td>
                        ) : (
                            <td>&mdash;</td>
                        )}
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
                    {hosted_party.size ? (
                        <React.Fragment>
                            <tr>
                                <th>Party Size</th>
                                <th>XP / Party Member</th>
                                <th>Challenge Classification</th>
                            </tr>
                            <tr>
                                <td>{hosted_party.size}</td>
                                <td>
                                    <XpRating
                                        xpRating={xp / hosted_party.size}
                                    />
                                </td>
                                <td>
                                    <EncounterRating
                                        encounter={xp_rating}
                                        party={hosted_party.challenge}
                                    />
                                </td>
                            </tr>
                        </React.Fragment>
                    ) : null}
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
                                id={monster.id}
                                include={this.monsterLinks}
                            >
                                <BaseLinkButton
                                    icon="minus"
                                    altStyle={true}
                                    className="warning"
                                    action={this.onRemoveMonsterButton(monster.id)}
                                />
                                <BaseLinkButton
                                    icon="plus"
                                    altStyle={true}
                                    className="good"
                                    action={this.onAddMonsterButton(monster.id)}
                                />
                            </MonsterLinks>
                        </th>
                        <td>
                            <ChallengeRating
                                challengeRating={monster.challenge_rating_precise}
                                precise={true}
                            />
                            {m.count > 1 ? (
                                <span>(
                                    <ChallengeRating
                                        challengeRating={
                                            monster.challenge_rating_precise
                                            * m.count
                                        }
                                        precise={true}
                                    />
                                )</span>
                            ) : null}
                        </td>
                        <td>
                            <XpRating
                                xpRating={monster.xp_rating}
                            />
                            {m.count > 1 ? (
                                <span>(
                                    <XpRating
                                        xpRating={
                                            monster.xp_rating
                                            * m.count
                                        }
                                    />
                                )</span>
                            ) : null}
                        </td>
                        <td>{monster.hit_points}</td>
                        <td>{monster.armor_class}</td>
                        <td>
                            {monster.average_damage}
                            {m.count > 1 ? (
                                <span>(
                                    {monster.average_damage * m.count}
                                )</span>
                            ) : null}
                        </td>
                        <td>
                            {monster.attack_bonus ? (
                                <span>
                                    Hit&nbsp;
                                    <Bonus
                                        bonus={monster.attack_bonus}
                                        />
                                </span>
                            ) : null}
                            {monster.spell_save_dc ? (
                                <span>
                                    DC &ge; {monster.spell_save_dc}
                                </span>
                            ) : null}
                        </td>
                    </tr>;
                })}</tbody>
                <tbody>
                    <tr>
                        <th>
                            <a
                                className="nice-btn-alt cursor-pointer icon fa-plus"
                                onClick={this.toggleDialog}
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

            {dialog ? (
                <MonsterPicker
                    monsters={monsters}
                    onDone={this.toggleDialog}
                    onFilter={this.onMonsterFilter}
                    onPick={this.onAddMonster}
                    label="Add monster"
                    icon="plus"
                />
            ) : null}
        </React.Fragment>;
    }
}

EncounterEdit.propTypes = {
    setState: PropTypes.func.isRequired,
    recompute: PropTypes.func.isRequired,
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    size: PropTypes.number,
    monsters: PropTypes.objectOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
        })
    ),
    monster_ids: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
        })
    ),
    modifier: PropTypes.shape({
        monster: PropTypes.number.isRequired,
        party: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
    }),
    challenge_rating: PropTypes.number,
    challenge_modified: PropTypes.number,
    challenge_rating_precise: PropTypes.number,
    xp: PropTypes.number,
    xp_modified: PropTypes.number,
    xp_rating: PropTypes.number,
    hosted_party: PropTypes.shape({
        id: PropTypes.number,
        size: PropTypes.number.isRequired,
        challenge: PropTypes.shape({
            easy: PropTypes.number.isRequired,
            medium: PropTypes.number.isRequired,
            hard: PropTypes.number.isRequired,
            deadly: PropTypes.number.isRequired,
        }),
    }),
};

EncounterEdit.defaultProps = {
    id: null,
    name: '',
    description: '',
    size: 0,
    monsters: {},
    monster_ids: [],
    modifier: {
        monster: 1.0,
        party: 1.0,
        total: 1.0,
    },
    challenge_rating: 0,
    challenge_modified: 0,
    challenge_rating_precise: 0,
    xp: 0,
    xp_modified: 0,
    xp_rating: 0,
    hosted_party: {
        size: 0,
    },
};

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
