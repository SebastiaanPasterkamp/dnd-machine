import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
} from 'lodash/fp';

import utils from '../../../utils';

import ListDataWrapper from '../../../hocs/ListDataWrapper';

import CampaignLabel from '../../../components/CampaignLabel';
import ChallengeRating from '../../../components/ChallengeRating';
import EncounterLinks from '../../../components/EncounterLinks';
import MonsterLabel from '../../../components/MonsterLabel';
import XpRating from '../../../components/XpRating';

const TableRow = function({
    id, campaign_id, hostedParty, name, monster_ids, challenge_rating,
    xp_rating, challenge_modified, xp, xp_modified,
}) {
    const ratingStyle = hostedParty
        ? utils.closest(
            {
                muted: 0,
                info: hostedParty.challenge.easy,
                good: hostedParty.challenge.medium,
                warning: hostedParty.challenge.hard,
                bad: hostedParty.challenge.deadly,
            },
            xp_rating,
            ratingStyle
        )
        : 'muted';

    return (
        <tr data-name={id}>
            <th>
                {name}
                <EncounterLinks
                    id={id}
                    altStyle={true}
                />
            </th>
            <td>
                {map(monster => (
                    <span key={monster.id}>
                        {monster.count}
                        &nbsp;x&nbsp;
                        <MonsterLabel
                            monster_id={monster.id}
                        />
                    </span>
                ))(monster_ids)}
            </td>
            <td className={ratingStyle}>
                <span>
                    <strong>Challenge:</strong>&nbsp;
                    <ChallengeRating challengeRating={challenge_rating} />
                    &nbsp;/&nbsp;
                    <XpRating xpRating={xp} />
                </span>
                {hostedParty ? (
                    <span>
                        <strong>Modified:</strong>&nbsp;
                        <ChallengeRating challengeRating={challenge_modified} />
                        &nbsp;/&nbsp;
                        <XpRating xpRating={xp_modified} />
                    </span>
                ) : null}
            </td>
            <td>
                {campaign_id ? (
                    <CampaignLabel id={campaign_id} />
                ) : null }
            </td>
        </tr>
    );
};

TableRow.propTypes = {
    id: PropTypes.number.isRequired,
    campaign_id: PropTypes.number,
    hostedParty: PropTypes.shape({
        challenge: PropTypes.shape({
            easy: PropTypes.number,
            medium: PropTypes.number,
            hard: PropTypes.number,
            deadly: PropTypes.number,
        }),
    }),
    name: PropTypes.string.isRequired,
    monster_ids: PropTypes.arrayOf( PropTypes.object ),
    challenge_rating: PropTypes.number,
    xp_rating: PropTypes.number,
    xp: PropTypes.number,
    challenge_modified: PropTypes.number,
    xp_modified: PropTypes.number,
};

TableRow.defaultProps = {
    id: null,
    campaign_id: null,
    hostedParty: null,
    name: '',
    monster_ids: [],
    challenge_rating: null,
    xp_rating: null,
    xp: null,
    challenge_modified: null,
    xp_modified: null,
};

export default ListDataWrapper(
    TableRow,
    ['hosted_party'],
    null,
    {hosted_party: 'hostedParty'}
);
