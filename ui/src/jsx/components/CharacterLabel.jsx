import React from 'react';
import PropTypes from 'prop-types';
import {
    assign,
} from 'lodash/fp';

import '../../sass/_character-label.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';
import Progress from '../components/Progress.jsx';

export class CharacterLabel extends LazyComponent
{
    renderInfo() {
        const {
            character,
            characterUpdate,
            genders,
            alignments,
            showName,
            showInfo,
        } = this.props;

        if (!showInfo) {
            return null;
        }

        const {
            name,
            level,
            gender,
            race,
            class: _class,
            alignment,
        } = assign(character, characterUpdate);

        return (
            <div className="character-label">
                {name && showName ? (
                    <span className="character-label__name">
                        {name}
                    </span>
                ) : null}
                <span className="character-label__item">
                    Level {level}
                </span>
                <ListLabel
                    items={genders}
                    value={gender}
                />
                <span className="character-label__item">
                    {race}
                </span>
                <span className="character-label__item">
                     {_class}
                 </span>
                <ListLabel
                    className="character-label__alignment"
                    items={alignments}
                    value={alignment}
                />
            </div>
        );
    }

    renderProgress() {
        const {
            character,
            characterUpdate,
            showProgress,
        } = this.props;

        if (!showProgress) {
            return null;
        }

        const {
            level, adventure_checkpoints,
            xp_progress, xp_level,
            acp_progress, acp_level,
        } = assign(character, characterUpdate);

        if (adventure_checkpoints) {
            return (
                <Progress
                    value={acp_progress}
                    total={acp_level}
                    color={"brand"}
                    labels={[
                        {
                            value: 1.0,
                            label: `Level ${level} (${acp_progress} / ${acp_level})`,
                        },
                        {
                            value: 0.5,
                            label: `${level} (${acp_progress}/${acp_level})`,
                        },
                        {
                            value: 0.25,
                            label: `${level+(acp_progress*0.1)}`,
                        },
                    ]}
                />
            );
        }

        return (
            <Progress
                value={xp_progress}
                total={xp_level}
                color={"good"}
                labels={[
                    {
                        value: 1.0,
                        label: `Level ${level} (${xp_progress} / ${xp_level})`,
                    },
                    {
                        value: 0.5,
                        label: `${xp_progress} / ${xp_level}`,
                    },
                    {
                        value: 0.25,
                        label: xp_progress,
                    },
                    {
                        value: 0.0,
                        label: level,
                    }
                ]}
            />
        );
    }

    render() {
        return (
            <div className="character inline">
                {this.renderInfo()}
                {this.renderProgress()}
            </div>
        );
    }
}

CharacterLabel.propTypes = {
    character_id: PropTypes.number,
    showName: PropTypes.bool,
    showInfo: PropTypes.bool,
    showProgress: PropTypes.bool,
    character: PropTypes.shape({
        race: PropTypes.string,
        'class': PropTypes.string,
        background: PropTypes.string,
        name: PropTypes.string,
        level: PropTypes.number,
        gender: PropTypes.string,
        alignment: PropTypes.string,
        xp: PropTypes.number,
        xp_progress: PropTypes.number,
        xp_level: PropTypes.number,
        adventure_checkpoints: PropTypes.number,
        acp_progress: PropTypes.number,
        acp_level: PropTypes.number,
    }),
    characterUpdate: PropTypes.object,
    alignments: PropTypes.array,
    genders: PropTypes.array,
};

CharacterLabel.defaultProps = {
    character: {},
    characterUpdate: {},
    genders: [],
    alignments: [],
    showName: true,
    showInfo: true,
    showProgress: false,
}

export default ListDataWrapper(
    ObjectDataWrapper(
        CharacterLabel,
        [{type: 'character', id: 'character_id'}]
    ),
    [
        'alignments',
        'genders',
    ],
    'items'
);
