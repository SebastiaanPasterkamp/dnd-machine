import React from 'react';
import PropTypes from 'prop-types';

import ChallengeRating from '../components/ChallengeRating.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ListLabel from '../components/ListLabel.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';
import XpRating from '../components/XpRating.jsx';


import '../../sass/_monster-label.scss';

export const MonsterLabel = function({
    monster, showType, size_hit_dice, monster_types, alignments,
}) {
    if (!monster) {
        return null;
    }

    return (
        <div className="monster-label inline">
            <span className="monster-label--name">
                {monster.name}
                &nbsp;
                (<ChallengeRating
                    challengeRating={monster.challenge_rating}
                />
                &nbsp;/&nbsp;
                <XpRating
                    xpRating={monster.xp}
                />)
            </span>
            <span className="monster-label--type">
                <ListLabel
                    items={size_hit_dice}
                    value={monster.size}
                />
                &nbsp;
                <ListLabel
                    items={monster_types}
                    value={monster.type}
                />
                &nbsp;
                (<ListLabel
                    items={alignments}
                    value={monster.alignment}
                />)
            </span>
        </div>
    )
};

MonsterLabel.defaultProps = {
    showType: false,
    monster: null,
    size_hit_dice: [],
    monster_types: [],
    alignments: [],
};

MonsterLabel.propTypes = {
    showType: PropTypes.bool,
    monster: PropTypes.object,
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