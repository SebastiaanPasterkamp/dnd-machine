import React from 'react';
import PropTypes from 'prop-types';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';
import Progress from '../components/Progress.jsx';

export class CharacterLabel extends LazyComponent
{
    render() {
        const {
            character, genders = [], alignments = [], showProgress,
        } = this.props;

        if (!character) {
            return null;
        }

        return <div className="character inline">
            {character.name},
            Level {character.level}
            &nbsp;
            <ListLabel
                items={genders}
                value={character.gender}
                />
            &nbsp;
            {character.race}
            &nbsp;
            {character.class}
            &nbsp;
            (<ListLabel
                    items={alignments}
                    value={character.alignment}
                    />)
            {showProgress
                ? <Progress
                    value={character.xp_progress}
                    total={character.xp_level}
                    color={"good"}
                    labels={[
                        {
                            value: 0.75,
                            label: character.xp_progress
                                + " / "
                                + character.xp_level
                        },
                        {
                            value: 0.33,
                            label: character.xp_progress
                        },
                        {
                            value: 0.10,
                            label: character.level
                        }
                    ]}
                    />
                : null
            }
        </div>;
    }
}

CharacterLabel.propTypes = {
    character_id: PropTypes.number.isRequired,
    showProgress: PropTypes.bool,
    character: PropTypes.shape({
        race: PropTypes.string.isRequired,
        'class': PropTypes.string.isRequired,
        background: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        level: PropTypes.number.isRequired,
        gender: PropTypes.string,
        alignment: PropTypes.string,
        xp_progress: PropTypes.number.isRequired,
        xp_level: PropTypes.number.isRequired,
    }),
    alignments: PropTypes.array,
    genders: PropTypes.array,
};

export default ListDataWrapper(
    ObjectDataWrapper(
        CharacterLabel,
        [{type: 'character', id: 'character_id'}]
    ),
    ['alignments', 'genders'],
    'items'
);