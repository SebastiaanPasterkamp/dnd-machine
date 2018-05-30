import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';
import {sprintf} from 'sprintf-js';

import '../../sass/_view-character.scss';

import BaseViewWrapper from '../hocs/BaseViewWrapper.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import {ArmorLabel} from '../components/ArmorLabel.jsx';
import Bonus from '../components/Bonus.jsx';
import CharacterLinks from '../components/CharacterLinks.jsx';
import CheckBox from '../components/CheckBox.jsx';
import DiceNotation from '../components/DiceNotation.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';
import Panel from '../components/Panel.jsx';
import Progress from '../components/Progress.jsx';
import Reach from '../components/Reach.jsx';
import UserLabel from '../components/UserLabel.jsx';
import {SpellLabel} from '../components/SpellLabel.jsx';
import {WeaponLabel} from '../components/WeaponLabel.jsx';

const viewConfig = {
    className: 'character-view',
    icon: 'fa-user-secret',
    label: 'Character'
};


export class CharacterDescription extends LazyComponent
{
    render() {
        const {
            id, name, race, 'class': _class, level, genders = [],
            gender, alignments = [], alignment, xp_progress,
            xp_level
        } = this.props;

        return <Panel
                key="description"
                className="character-view__description info"
                header="Description"
            >
            <CharacterLinks
                className="pull-right"
                character_id={id}
                />

            <h3>{name}</h3>

            <h4>
                Level {level}
                &nbsp;
                <ListLabel
                    items={genders}
                    value={gender}
                    />
                &nbsp;
                {race}
                &nbsp;
                {_class}
                &nbsp;
                (<ListLabel
                    items={alignments}
                    value={alignment}
                    />)
            </h4>

            <Progress
                value={xp_progress}
                total={xp_level}
                color={"good"}
                label={`${level} (${xp_progress} / ${xp_level})`}
                />
        </Panel>;
    }
};


export class CharacterInformation extends LazyComponent
{
    render() {
        const {
            'class': _class, race, background, alignment,
            alignments = [], xp, user_id
        } = this.props;

        return <Panel
                key="info"
                className="character-view__info info"
                header="Info"
            >
            <thead>
                <tr>
                    <th>Class</th>
                    <th>Background</th>
                    <th>Player</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{_class}</td>
                    <td>{background}</td>
                    <td>
                        <UserLabel
                            user_id={user_id}
                            />
                    </td>
                </tr>
            </tbody>
            <thead>
                <tr>
                    <th>Race</th>
                    <th>Alignment</th>
                    <th>XP</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{race}</td>
                    <td>
                        <ListLabel
                            items={alignments}
                            value={alignment}
                            />
                    </td>
                    <td>{xp} XP</td>
                </tr>
            </tbody>
        </Panel>;
    }
}


export class CharacterBasics extends LazyComponent
{
    render() {
        const {
            armor_class, armor_class_bonus, hit_points, level,
            hit_dice, speed, height, weight, age, initiative_bonus,
            passive_perception, proficiency, spell, _statistics
        } = this.props;

        return <Panel
                key="base"
                className="character-view__base info"
                header="Base"
            >
            <tbody>
                <tr>
                    <th>Armor Class</th>
                    <td>
                        {armor_class}
                        {armor_class_bonus
                            ? <React.Fragment>
                                &nbsp;/&nbsp;
                                <Bonus
                                    bonus={armor_class_bonus}
                                    />
                                </React.Fragment>
                            : null
                        }
                    </td>
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
                        <Reach
                            distance={speed}
                            />
                    </td>
                </tr>
                <tr>
                    <th>Height</th>
                    <td>
                        <Reach
                            distance={height}
                            />
                    </td>
                </tr>
                <tr>
                    <th>Weight</th>
                    <td>{weight} lb.</td>
                </tr>
                <tr>
                    <th>Age</th>
                    <td>{age} years</td>
                </tr>
                <tr>
                    <th>Initiative Modifier</th>
                    <td>
                        <Bonus
                            bonus={initiative_bonus}
                            />
                    </td>
                </tr>
                <tr>
                    <th>Passive Perception</th>
                    <td>{passive_perception}</td>
                </tr>
                <tr>
                    <th>Proficiency Bonus</th>
                    <td>
                        <Bonus
                            bonus={proficiency}
                            />
                    </td>
                </tr>

                {spell.stat ? <React.Fragment>
                    <tr>
                        <th>Spell Ability</th>
                        <td>
                            <ListLabel
                                items={_statistics || []}
                                value={spell.stat}
                                />
                        </td>
                    </tr>
                    <tr>
                        <th>Spell DC</th>
                        <td>{spell.safe_dc}</td>
                    </tr>
                    <tr>
                        <th>Spell Attack Modifier</th>
                        <td>
                            <Bonus
                                bonus={spell.attack_modifier}
                                />
                        </td>
                    </tr>
                </React.Fragment> : null}
            </tbody>
        </Panel>;
    }
};

export class CharacterStatistics extends LazyComponent
{
    render() {
        const {
            statistics, _statistics, proficiencies, saving_throws
        } = this.props;

        if (!_statistics) {
            return <div className="character-view__statistics"></div>;
        }

        return <Panel
                className="character-view__statistics info"
                header="Statistics"
            >
            <thead>
                <tr>
                    <th />
                    <th>Statistic</th>
                    <th>Modifier</th>
                    <th>Saving Throw</th>
                </tr>
            </thead>
            <tbody>{_.map(_statistics, stat => (
                <tr key={stat.code}>
                    <th>{stat.label}</th>
                    <td>{statistics.base[stat.code]}</td>
                    <td>
                        <Bonus
                            bonus={statistics.modifiers[stat.code]}
                            />
                    </td>
                    <td>
                    <CheckBox isChecked={_.includes(
                            proficiencies.saving_throws,
                            stat.code
                        )} />
                    <Bonus
                        bonus={saving_throws[stat.code]}
                        />
                    </td>
                </tr>
            ))}</tbody>
        </Panel>;
    }
};

export class CharacterSkills extends LazyComponent
{
    render() {
        const {
            _statistics, _skills, skills, proficiencies,
        } = this.props;

        if (_.isNil(proficiencies)) {
            return <div className="character-view__skills"></div>;
        }

        return <Panel
            className="character-view__skills info"
            header="Skills" contentComponent="table"
        >
        {_.map(_statistics, stat => (
            <React.Fragment  key={'stat-' + stat.code}>
                <thead>
                    <tr>
                        <th colSpan="2" className="text-align-center">{stat.label}</th>
                    </tr>
                </thead>

                <tbody>
                {_.map(_skills, skill => {
                    if (skill.stat != stat.code) {
                        return null;
                    }

                    return <tr key={skill.code}>
                        <th>{skill.label}</th>
                        <td>
                            <CheckBox isChecked={_.includes(
                                    proficiencies.skills,
                                    skill.code
                                )} />
                            {proficiencies.expertise.length
                                ? <CheckBox isChecked={_.includes(
                                        proficiencies.expertise,
                                        skill.code
                                    )} />
                                : null
                            }
                            <Bonus
                                bonus={skills[skill.code]}
                                />
                        </td>
                    </tr>;
                })}
                </tbody>
            </React.Fragment>
        ))}
        </Panel>;
    }
};

export class CharacterEquipment extends LazyComponent
{
    render() {
        const {
            weapons = [], weapon_properties = [], weapon_types = [],
            armor = [], armor_types = [], items = []
        } = this.props;

        return <Panel
                key="equipment"
                className="character-view__equipment info"
                header="Equipment"
            >
            {weapons.length
                ? <React.Fragment>
                    <strong>Weapons</strong>

                    <ul>
                    {_.map(weapons, (weapon, i) => (
                        <li key={'weapon-' + i}>
                            {weapon.count > 1
                                ? `${weapon.count} x `
                                : null
                            }
                            <WeaponLabel
                                weapon_properties={weapon_properties}
                                weapon_types={weapon_types}
                                weapon_id={weapon.id}
                                weapon={weapon}
                                />
                        </li>
                    ))}
                    </ul>
                </React.Fragment>
                : null
            }

            {armor.length
                ? <React.Fragment>
                    <strong>Armor</strong>

                    <ul>
                    {_.map(armor, (_armor, i) => (
                        <li key={'armor-' + i}>
                            {_armor.count > 1
                                ? `${_armor.count} x `
                                : null
                            }
                            <ArmorLabel
                                armor_types={armor_types}
                                armor_id={_armor.id}
                                armor={_armor}
                                />
                        </li>
                    ))}
                    </ul>
                </React.Fragment>
                : null
            }

            <strong>Gear</strong> :

            <ul>
            {_.map(items, (itemset, set) => {
                let gear = _.countBy(itemset, (item) => {
                    if (_.isObject(item)) {
                        return item.label || item.name;
                    }
                    return item;
                });

                return _.map(gear, (cnt, item) => (
                    <li key={'item-' + item}>
                        {cnt > 1
                            ? `${cnt} x `
                            : null
                        }
                        {item}
                    </li>
                ));
            })}
            </ul>
        </Panel>;
    }
};

export class CharacterBackstory extends LazyComponent
{
    render() {
        const {
            backstory
        } = this.props;

        return <Panel
                key="backstory"
                className="character-view__backstory info"
                header="Backstory"
            >
            <MDReactComponent
                text={backstory || ''}
                />
        </Panel>;
    }
};

export class CharacterPersonality extends LazyComponent
{
    render() {
        const {
            personality = {}
        } = this.props;

        if (_.isEmpty(_.keys(personality))) {
            return <div className="character-view__personality"></div>;
        }

        return <Panel
                key="personality"
                className="character-view__personality info"
                header="Personality"
            >
            {_.map({
                'traits': 'Traits',
                'ideals': 'Ideals',
                'bonds': 'Bonds',
                'flaws': 'Flaws'
            }, (label, field) => (
                <React.Fragment key={field}>
                    <strong>{label}</strong>

                    <MDReactComponent
                        text={personality[field] || ''}
                        />
                </React.Fragment>
            ))}
        </Panel>;
    }
};

export class CharacterSpells extends LazyComponent
{
    render() {
        const {
            spell, magic_components, magic_schools
        } = this.props;

        if (
            !spell.list.length
            && !spell.prepared.length
        ) {
            return null;
        }

        return <Panel
                key="equipment"
                className="character-view__spells info"
                header="Spells"
            >
            {_.map(spell.level, (spells, level) => {
                if (!spells.length) {
                    return null;
                }
                return _.map(spells, (spell, i) => (
                    <SpellLabel
                        key={spell.id}
                        magic_components={magic_components}
                        magic_schools={magic_schools}
                        spell_id={spell.id}
                        spell={spell}
                        tooltip={true}
                        />
                ));
            })}
        </Panel>;
    }
};

export class CharacterAbilities extends LazyComponent
{
    render() {
        const {
            abilities
        } = this.props;

        return <Panel
                key="abilities"
                className="character-view__abilities info"
                header="Abilities"
            >
            <ul>
            {_.map(abilities, (data, label) => (
                <li key={label}>
                    <strong>{label}</strong>
                    <MDReactComponent
                        text={sprintf(
                            data.description,
                            data
                        )}
                        />
                </li>
            ))}
            </ul>
        </Panel>;
    }
};

export class CharacterTraits extends LazyComponent
{
    render() {
        const {
            info
        } = this.props;

        return <Panel
                key="traits"
                className="character-view__traits info"
                header="Traits"
            >
            <ul>
            {_.map(info, (description, label) => (
                <li key={label}>
                    <strong>{label}</strong>
                    <MDReactComponent
                        text={description || ''}
                        />
                </li>
            ))}
            </ul>
        </Panel>;
    }
};


export class CharactersView extends React.Component
{
    render() {
        return <React.Fragment>
            <CharacterDescription
                {...this.props}
                />

            <CharacterInformation
                {...this.props}
                />

            <CharacterBasics
                {...this.props}
                />

            <CharacterEquipment
                {...this.props}
                />

            <CharacterSkills
                {...this.props}
                />

            <CharacterStatistics
                {...this.props}
                />

            <CharacterBackstory
                {...this.props}
                />

            <CharacterPersonality
                {...this.props}
                />

            <CharacterSpells
                {...this.props}
                />

            <CharacterAbilities
                {...this.props}
                />

            <CharacterTraits
                {...this.props}
                />
        </React.Fragment>;
    }
}

export const CharacterView = BaseViewWrapper(
    CharactersView, viewConfig
);

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        CharactersView, viewConfig, "character"
    ),
    [
        'alignments',
        'armor_types',
        'genders',
        'languages',
        "magic_components",
        "magic_schools",
        'skills',
        'statistics',
        'weapon_properties',
        "weapon_types",
    ],
    'items',
    {
        'languages': '_languages',
        'skills': '_skills',
        'statistics': '_statistics',
    }
);
