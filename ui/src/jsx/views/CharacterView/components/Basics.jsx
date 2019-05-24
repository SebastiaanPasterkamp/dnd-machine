import React from 'react';
import PropTypes from 'prop-types';

import ListDataWrapper from '../../../hocs/ListDataWrapper.jsx';

import Bonus from '../../../components/Bonus';
import DiceNotation from '../../../components/DiceNotation';
import ListLabel from '../../../components/ListLabel';
import Panel from '../../../components/Panel.jsx';
import Reach from '../../../components/Reach';
import WeightLabel from '../../../components/WeightLabel';

const Basics = function({
    armor_class, armor_class_bonus, hit_points, level,
    hit_dice, speed, height, weight, age, initiative_bonus,
    passive_perception, proficiency, spell, statistics,
}) {
    const {
        stat: spell_stat,
        safe_dc: spell_dc,
        attack_modifier: spell_mod,
    } = spell || {};

    return (
        <Panel
           key="base"
           className="character-view__base info"
           header="Base"
        >
            <tbody>
                <tr>
                    <th>Armor Class</th>
                    {armor_class_bonus ? (
                        <td>
                            {armor_class}
                            &nbsp;/&nbsp;
                            <Bonus
                                bonus={armor_class_bonus}
                            />
                        </td>
                    ) : (
                        <td>{armor_class}</td>
                    )}
                </tr>
                <tr>
                    <th>Hit Points</th>
                    <td>{hit_points}</td>
                </tr>
                <tr>
                    <th>Hit Dice</th>
                    <td>
                        <DiceNotation
                            dice_count={level}
                            dice_size={hit_dice}
                        />
                    </td>
                </tr>
                <tr>
                    <th>Speed</th>
                    <td>
                        <Reach distance={speed} />
                    </td>
                </tr>
                <tr>
                    <th>Height</th>
                    <td>
                        <Reach distance={height} />
                    </td>
                </tr>
                <tr>
                    <th>Weight</th>
                    <td><WeightLabel weight={weight} /></td>
                </tr>
                <tr>
                    <th>Age</th>
                    <td>{age ? `${age} years` : null}</td>
                </tr>
                <tr>
                    <th>Initiative Modifier</th>
                    <td>
                        <Bonus bonus={initiative_bonus} />
                    </td>
                </tr>
                <tr>
                    <th>Passive Perception</th>
                    <td>{passive_perception}</td>
                </tr>
                <tr>
                    <th>Proficiency Bonus</th>
                    <td>
                        <Bonus bonus={proficiency} />
                    </td>
                </tr>

                {spell_stat && (<React.Fragment>
                    <tr>
                        <th>Spell Ability</th>
                        <td>
                            <ListLabel
                                items={statistics}
                                value={spell_stat}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>Spell DC</th>
                        <td>{spell_dc}</td>
                    </tr>
                    <tr>
                        <th>Spell Attack Modifier</th>
                        <td>
                            <Bonus bonus={spell_mod} />
                        </td>
                    </tr>
                </React.Fragment>)}
            </tbody>
        </Panel>
    );
};

Basics.propTypes = {
    armor_class: PropTypes.number,
    armor_class_bonus: PropTypes.number,
    hit_points: PropTypes.number,
    level: PropTypes.number,
    hit_dice: PropTypes.number,
    speed: PropTypes.number,
    height: PropTypes.number,
    weight: PropTypes.number,
    age: PropTypes.number,
    initiative_bonus: PropTypes.number,
    passive_perception: PropTypes.number,
    proficiency: PropTypes.number,
    spell: PropTypes.shape({
        stat: PropTypes.string.isRequired,
        safe_dc: PropTypes.number.isRequired,
        attack_modifier: PropTypes.number.isRequired,
    }),
    statistics: PropTypes.array,
};

Basics.defaultProps = {
    armor_class: 10,
    armor_class_bonus: null,
    hit_points: 1,
    level: 1,
    hit_dice: 4,
    speed: 30,
    height: null,
    weight: null,
    age: null,
    initiative_bonus: 0,
    passive_perception: 10,
    proficiency: 2,
    spell: null,
    statistics: [],
};

export { Basics };

export default ListDataWrapper(
    Basics,
    [
        'statistics',
    ],
    'items'
);
