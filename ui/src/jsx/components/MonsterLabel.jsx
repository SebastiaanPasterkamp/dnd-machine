import React from 'react';
import PropTypes from 'prop-types';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';

export class MonsterLabel extends LazyComponent
{
    renderType(spell) {
        const {
            monster, showType, size_hit_dice = [],
            monster_types = [], alignments = [],
        } = this.props;

        if (!showType) {
            return null;
        }

        return <span>
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
        </span>;
    }

    render() {
        const { monster } = this.props;

        if (!monster) {
            return null;
        }

        return <div className="monster inline">
            {monster.name},
            CR {monster.challenge_rating}
            {this.renderType()}
        </div>;
    }
}

MonsterLabel.defaultProps = {
    showType: false,
};

MonsterLabel.propTypes = {
    showType: PropTypes.bool,
    monster: PropTypes.object,
}

export default ListDataWrapper(
    ObjectDataWrapper(
        MonsterLabel,
        [{type: 'monster', id: 'monster_id'}]
    ),
    ['alignments', 'size_hit_dice', 'monster_types'],
    'items'
);