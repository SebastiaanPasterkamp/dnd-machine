import React from 'react';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';
import Progress from '../components/Progress.jsx';

export class CharacterLabel extends LazyComponent
{
    render() {
        if (!this.props.character) {
            return '';
        }

        const char = this.props.character;
        return <div className="character inline">
            {char.name},
            Level {char.level}
            &nbsp;
            <ListLabel
                    items={this.props.genders}
                    value={char.gender}
                    />
            &nbsp;
            {char.race}
            &nbsp;
            {char.class}
            &nbsp;
            (<ListLabel
                    items={this.props.alignments}
                    value={char.alignment}
                    />)
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
                            label: char.xp_progress
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

export default ListDataWrapper(
    ObjectDataWrapper(
        CharacterLabel,
        [{type: 'character', id: 'character_id'}]
    ),
    ['alignments', 'genders'],
    'items'
);