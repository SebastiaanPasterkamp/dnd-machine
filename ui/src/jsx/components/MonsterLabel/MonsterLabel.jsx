import React from 'react';
import PropTypes from 'prop-types';

import CampaignLabel from '../CampaignLabel';
import ChallengeRating from '../ChallengeRating';
import ListDataWrapper from '../../hocs/ListDataWrapper';
import ListLabel from '../ListLabel';
import ObjectDataWrapper from '../../hocs/ObjectDataWrapper';
import XpRating from '../XpRating';

import './sass/_monster-label.scss';

export const MonsterLabel = function({
    monster: {
        id,
        name,
        campaign_id,
        challenge_rating,
        xp,
        size,
        type,
        alignment,
    },
    showName, showRating, showType, showCampaign,
    size_hit_dice, monster_types, alignments,
}) {
    if (id === undefined) {
        return null;
    }

    return (
        <div className="monster-label inline">
            {showName ? (
                <span className="monster-label--name">
                    {name}
                </span>
            ) : null}
            {showRating ? (
                <span className="monster-label--rating">
                    <ChallengeRating
                        challengeRating={challenge_rating}
                    />
                    {` / `}
                    <XpRating
                        xpRating={xp}
                    />
                </span>
            ) : null}
            {showType ? (
                <span className="monster-label--type">
                    <ListLabel
                        items={size_hit_dice}
                        data-name="size"
                        value={size}
                    />
                    <ListLabel
                        items={monster_types}
                        data-name="type"
                        value={type}
                    />
                    <ListLabel
                        items={alignments}
                        data-name="alignment"
                        value={alignment}
                    />
                </span>
            ) : null}
            {showCampaign && campaign_id ? (
                <span className="monster-label--campaign">
                    <CampaignLabel id={campaign_id} />
                </span>
            ) : null}
        </div>
    )
};

MonsterLabel.defaultProps = {
    showName: true,
    showRating: false,
    showType: false,
    showCampaign: false,
    monster: {},
    size_hit_dice: [],
    monster_types: [],
    alignments: [],
};

MonsterLabel.propTypes = {
    showName: PropTypes.bool,
    showRating: PropTypes.bool,
    showType: PropTypes.bool,
    showCampaign: PropTypes.bool,
    monster: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        campaign_id: PropTypes.number,
        challenge_rating: PropTypes.number,
        xp: PropTypes.number,
        size: PropTypes.string,
        type: PropTypes.string,
        alignment: PropTypes.string,
    }),
    size_hit_dice: PropTypes.array,
    monster_types: PropTypes.array,
    alignments: PropTypes.array,
}

export default ListDataWrapper(
    ObjectDataWrapper(
        MonsterLabel,
        [{type: 'monster', id: 'monster_id'}]
    ),
    ['alignments', 'size_hit_dice', 'monster_types'],
    'items'
);
