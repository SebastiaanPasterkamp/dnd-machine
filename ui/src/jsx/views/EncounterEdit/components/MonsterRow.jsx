import React from 'react';
import PropTypes from 'prop-types';

import { BaseLinkButton } from '../../../components/BaseLinkGroup/index';
import Bonus from '../../../components/Bonus';
import ChallengeRating from '../../../components/ChallengeRating';
import CountPrefix from '../../../components/CountPrefix';
import MonsterLabel from '../../../components/MonsterLabel';
import MonsterLinks from '../../../components/MonsterLinks';
import XpRating from '../../../components/XpRating';

const monsterLinks = [ 'view' ];

export const MonsterRow = function({
    count,
    monster: {
        id,
        name,
        average_damage,
        attack_bonus,
        spell_save_dc,
        armor_class,
        hit_points,
        challenge_rating_precise,
        xp_rating,
    },
    onAddMonsterButton,
    onRemoveMonsterButton,
}) {
    if (id === undefined) {
        return null;
    }

    return (
        <tr>
            <th>
                <CountPrefix count={count} alwaysCount={true}>
                    {name}
                </CountPrefix>

                <MonsterLinks altStyle={true} id={id} include={monsterLinks}>
                    <BaseLinkButton
                        icon="minus"
                        altStyle={true}
                        className="warning"
                        action={onRemoveMonsterButton(id)}
                    />
                    <BaseLinkButton
                        icon="plus"
                        altStyle={true}
                        className="good"
                        action={onAddMonsterButton(id)}
                    />
                </MonsterLinks>
            </th>
            <td>
                <ChallengeRating
                    challengeRating={challenge_rating_precise}
                    precise={true}
                />
                {count > 1 ? (
                    <span>(
                        <ChallengeRating
                            challengeRating={challenge_rating_precise * count}
                            precise={true}
                        />
                    )</span>
                ) : null}
            </td>
            <td>
                <XpRating
                    xpRating={xp_rating}
                />
                {count > 1 ? (
                    <span>(
                        <XpRating xpRating={xp_rating * count} />
                    )</span>
                ) : null}
            </td>
            <td>{hit_points}</td>
            <td>{armor_class}</td>
            <td>
                {average_damage}
                {count > 1 ? (
                    <span>({average_damage * count})</span>
                ) : null}
            </td>
            <td>
                {attack_bonus ? (
                    <span>
                        Hit &nbsp; <Bonus bonus={attack_bonus} />
                    </span>
                ) : null}
                {spell_save_dc ? (
                    <span>DC &ge; {spell_save_dc}</span>
                ) : null}
            </td>
        </tr>
    );
};

MonsterRow.propTypes = {
    count: PropTypes.number.isRequired,
    monster: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        average_damage: PropTypes.number,
        attack_bonus: PropTypes.number,
        spell_save_dc: PropTypes.number,
        armor_class: PropTypes.number,
        hit_points: PropTypes.number,
        challenge_rating_precise: PropTypes.number,
        xp_rating: PropTypes.number,
    }),
    onAddMonsterButton: PropTypes.func.isRequired,
    onRemoveMonsterButton: PropTypes.func.isRequired,
};

MonsterRow.defaultProps = {
    count: 0,
    monster: {},
};

export default MonsterRow;
