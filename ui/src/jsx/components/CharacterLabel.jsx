import React from 'react';

import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import Progress from '../components/Progress.jsx';

class CharacterLabel extends LazyComponent
{
    render() {
        if (!this.props.character) {
            return '';
        }

        const char = this.props.character;
        return <div className="character inline">
            {[
                `${char.name},`,
                "Level", char.level,
                char.race,
                char.class,
                `(${char.alignment})`
            ].join(' ')}
            {this.props.progress || false
                ? <Progress
                    value={char.xp_progress}
                    total={char.xp_level}
                    color={"good"}
                    labels={[
                        {
                            value: 0.75,
                            label: char.xp_progress
                                + " / "
                                + char.xp_level
                        },
                        {
                            value: 0.33,
                            label: char.xp
                        },
                        {
                            value: 0.10,
                            label: char.level
                        }
                    ]}
                    />
                : null
            }
        </div>;
    }
}

export default ObjectDataWrapper(CharacterLabel, [
    {type: 'character', id: 'character_id'}
]);