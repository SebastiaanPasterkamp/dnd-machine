import React from 'react';
import PropTypes from 'prop-types';
import {
    find,
    findIndex,
    reduce,
    slice,
    map,
} from 'lodash/fp';

import './sass/_encounter-edit.scss';

import utils, { memoize } from '../../utils';

import ListDataWrapper from '../../hocs/ListDataWrapper';
import ObjectDataActions from '../../actions/ObjectDataActions';
import ObjectDataListWrapper from '../../hocs/ObjectDataListWrapper';
import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import { BaseLinkButton } from '../../components/BaseLinkGroup/index';
import Bonus from '../../components/Bonus';
import ButtonField from '../../components/ButtonField';
import ChallengeRating from '../../components/ChallengeRating';
import MonsterLabel from '../../components/MonsterLabel';
import MonsterLinks from '../../components/MonsterLinks';
import { MonsterPicker } from '../../components/MonsterPicker';
import ControlGroup from '../../components/ControlGroup';
import InputField from '../../components/InputField';
import Panel from '../../components/Panel';
import SingleSelect from '../../components/SingleSelect';
import MarkdownTextField from '../../components/MarkdownTextField';
import XpRating from '../../components/XpRating';

import ChallengePanel from './components/ChallengePanel';
import DescriptionPanel from './components/DescriptionPanel';
import MonsterRow from './components/MonsterRow';

export class EncounterEdit extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            dialog: false,
        };
        this.monsterLinks = ['view'];
        this.memoize = memoize.bind(this);
        this.onAddMonster = this.onAddMonster.bind(this);
        this.onAddMonsterButton = this.onAddMonsterButton.bind(this);
        this.onMonsterFilter = this.onMonsterFilter.bind(this);
        this.toggleDialog = this.toggleDialog.bind(this);
        this.onRemoveMonsterButton = this.onRemoveMonsterButton.bind(this);
    }

    onAddMonster(id) {
        const { monster_ids, setState, recompute } = this.props;
        const index = findIndex({id}, monster_ids);
        let update = [...monster_ids];

        if (index < 0) {
            const monster = {id, count: 1};
            update = [...update, monster];
        } else {
            update[index] = {
                ...update[index],
                count: update[index].count + 1,
            };
        }

        setState(
            { monster_ids: update },
            () => recompute()
        );
    }

    onMonsterFilter({ id }) {
        const { monster_ids } = this.props;

        return !find({id}, monster_ids);
    }

    toggleDialog() {
        this.setState({
            dialog: !this.state.dialog,
        });
    }

    onRemoveMonsterButton(id) {
        return this.memoize(`dec-${id}`, () => {
            const { monster_ids, setState, recompute } = this.props;
            const index = findIndex({id}, monster_ids);

            if (index < 0 || monster_ids[index].count <= 0) {
                return;
            }

            let update = [...monster_ids];
            update[index] = {
                ...update[index],
                count: update[index].count - 1,
            };

            setState(
                { monster_ids: update },
                () => recompute()
            );
        });
    }

    onAddMonsterButton(id) {
        return this.memoize(
            `inc-${id}`,
            () => this.onAddMonster(id)
        );
    };

    render() {
        const { dialog } = this.state;
        const {
            id, name, description, size, monster_ids,
            monsters, modifier, challenge_rating,
            challenge_modified, challenge_rating_precise,
            xp, xp_modified, xp_rating, hosted_party,
            campaign_id, setState,
        } = this.props;

        const summary = reduce(
            (summary, m) => {
                if (!m || !m.count) {
                    return summary;
                }
                const monster = monsters[m.id];
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
        )(monster_ids);

        const descriptionProps = {
            campaign_id, name, description, setState,
        };
        const challengeProps = {
            modifier, hosted_party,
            challenge_rating, challenge_modified, challenge_rating_precise,
            xp, xp_modified, xp_rating,
        };

        return <React.Fragment>
            <DescriptionPanel {...descriptionProps} />

            <ChallengePanel {...challengeProps} />

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

                <tbody>
                    {map((m) => (
                        <MonsterRow
                            key={m.id}
                            count={m.count}
                            monster={monsters[m.id] || {}}
                            onAddMonsterButton={this.onAddMonsterButton}
                            onRemoveMonsterButton={this.onRemoveMonsterButton}
                        />
                    ))(monster_ids)}
                </tbody>

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
    campaign_id: PropTypes.number,
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
            count: PropTypes.number.isRequired,
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
    campaign_id: null,
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
    hosted_party: null,
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
