import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';
import {sprintf} from 'sprintf-js';

import '../../sass/_view-character.scss';

import BaseViewWrapper from '../hocs/BaseViewWrapper.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import Bonus from '../components/Bonus.jsx';
import CharacterLinks from '../components/CharacterLinks.jsx';
import DiceNotation from '../components/DiceNotation.jsx';
import ListLabel from '../components/ListLabel.jsx';
import Panel from '../components/Panel.jsx';
import Progress from '../components/Progress.jsx';
import Reach from '../components/Reach.jsx';
import UserLabel from '../components/UserLabel.jsx';
import WeaponLabel from '../components/WeaponLabel.jsx';

const viewConfig = {
    className: 'character-view',
    icon: 'fa-user-secret',
    label: 'Character'
};

export class CharactersView extends React.Component
{
    renderStatistics() {
        if (_.isNil(this.props._statistics)) {
            return null;
        }

        return <Panel
                key="statistic"
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
            <tbody>{_.map(this.props._statistics, stat => {
                return <tr key={stat.code}>
                    <th>{stat.label}</th>
                    <td>{this.props.statistics.base[stat.code]}</td>
                    <td>
                        <Bonus
                            bonus={this.props.statistics.modifiers[stat.code]}
                            />
                    </td>
                    <td>
                    {_.includes(
                        this.props.proficiencies.saving_throws,
                        stat.code
                        )
                        ? <span className="icon fa-check-square-o">&nbsp;</span>
                        : <span className="icon fa-square-o">&nbsp;</span>
                    }
                    <Bonus
                        bonus={this.props.saving_throws[stat.code]}
                        />
                    </td>
                </tr>;
            })}</tbody>
        </Panel>;
    }

    renderSkills() {
        if (_.isNil(this.props.proficiencies)) {
            return null;
        }

        return <Panel
                key="skills"
                className="character-view__skills info"
                header="Skills"
            >
            {_.map(this.props._statistics, stat => [
                <thead key={'head-' + stat.code}>
                    <tr>
                        <th colSpan="2" className="text-align-center">{stat.label}</th>
                    </tr>
                </thead>,
                <tbody key={'body-' + stat.code}>{_.map(this.props._skills, skill => {
                    if (skill.stat != stat.code) {
                        return null;
                    }
                    return <tr key={skill.code}>
                        <th>{skill.label}</th>
                        <td>
                            {_.includes(
                                this.props.proficiencies.skills,
                                skill.code
                                )
                                ? <span className="icon fa-check-square-o">&nbsp;</span>
                                : <span className="icon fa-square-o">&nbsp;</span>
                            }
                            {(this.props.proficiencies.expertise || []).length ? (
                                _.includes(
                                    this.props.proficiencies.expertise,
                                    skill.code
                                    )
                                    ? <span className="icon fa-check-square-o">&nbsp;</span>
                                    : <span className="icon fa-square-o">&nbsp;</span>
                                ) : null
                            }
                            <Bonus
                                bonus={this.props.skills[skill.code]}
                                />
                        </td>
                    </tr>;
                })}</tbody>
            ])}
        </Panel>;
    }

    render() {
        return [
            <Panel
                    key="description"
                    className="character-view__description info"
                    header="Description"
                >
                <CharacterLinks
                    buttons={['edit', 'download']}
                    className="pull-right"
                    character_id={this.props.id}
                    />

                <h3>{this.props.name}</h3>

                <h4>
                    Level {this.props.level}
                    &nbsp;
                    <ListLabel
                        items={this.props.genders}
                        value={this.props.gender}
                        />
                    &nbsp;
                    {this.props.race}
                    &nbsp;
                    {this.props.class}
                    &nbsp;
                    (<ListLabel
                        items={this.props.alignments}
                        value={this.props.alignment}
                        />)
                </h4>

                <Progress
                    value={this.props.xp_progress}
                    total={this.props.xp_level}
                    color={"good"}
                    label={
                        this.props.level
                        + ' ('
                        + this.props.xp_progress
                        + " / "
                        + this.props.xp_level
                        + ')'
                    }
                    />
            </Panel>,

            <Panel
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
                        <td>{this.props.class}</td>
                        <td>{this.props.background}</td>
                        <td>
                            <UserLabel
                                user_id={this.props.user_id}
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
                        <td>{this.props.race}</td>
                        <td>
                            <ListLabel
                                items={this.props.alignments}
                                value={this.props.alignment}
                                />
                        </td>
                        <td>{this.props.xp} XP</td>
                    </tr>
                </tbody>
            </Panel>,

            <Panel
                    key="base"
                    className="character-view__base info"
                    header="Base"
                >
                <tbody>
                    <tr>
                        <th>Armor Class</th>
                        <td>{this.props.armor_class}</td>
                    </tr>
                    <tr>
                        <th>Hit Points</th>
                        <td>{this.props.hit_points}</td>
                    </tr>
                    <tr>
                        <th>Hit Dice</th>
                        <td>
                            <DiceNotation
                                dice_count={this.props.level}
                                dice_size={this.props.hit_dice}
                                />
                        </td>
                    </tr>
                    <tr>
                        <th>Speed</th>
                        <td>
                            <Reach
                                distance={this.props.speed}
                                />
                        </td>
                    </tr>
                    <tr>
                        <th>Height</th>
                        <td>
                            <Reach
                                distance={this.props.height}
                                />
                        </td>
                    </tr>
                    <tr>
                        <th>Weight</th>
                        <td>{this.props.weight} lb.</td>
                    </tr>
                    <tr>
                        <th>Age</th>
                        <td>{this.props.age} years</td>
                    </tr>
                    <tr>
                        <th>Initiative Modifier</th>
                        <td>
                            <Bonus
                                bonus={this.props.initiative_bonus}
                                />
                        </td>
                    </tr>
                    <tr>
                        <th>Passive Perception</th>
                        <td>{this.props.passive_perception}</td>
                    </tr>
                    <tr>
                        <th>Proficiency Bonus</th>
                        <td>
                            <Bonus
                                bonus={this.props.proficiency}
                                />
                        </td>
                    </tr>
                    <tr>
                        <th>Expertise Bonus</th>
                        <td>+4</td>
                    </tr>

                    <tr>
                        <th>Spells</th>
                        <td>
                            <ul>
                                <li>
                                    <strong>Class:</strong>
                                    {this.props.class}
                                </li>
                                <li>
                                    <strong>Ability:</strong>
                                    <ListLabel
                                        items={this.props.statistics}
                                        value={this.props.spell_stat}
                                        />
                                </li>
                                <li>
                                    <strong>DC:</strong>
                                    {this.props.spell_safe_dc}
                                </li>
                                <li>
                                    <strong>Attack Modifier:</strong>
                                    <Bonus
                                        bonus={this.props.spell_attack_modifier}
                                        />
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </Panel>,

            this.renderStatistics(),

            this.renderSkills(),

            <Panel
                    key="equipment"
                    className="character-view__equipment info"
                    header="Equipment"
                >
                <WeaponLabel
                    weapon_id={1}
                    />
            </Panel>,

            <Panel
                    key="backstory"
                    className="character-view__backstory info"
                    header="Backstory"
                >
                <MDReactComponent
                    text={this.props.backstory || ''}
                    />
            </Panel>,

            <Panel
                    key="spells"
                    className="character-view__spells info"
                    header="Spells"
                >
            </Panel>,

            <Panel
                    key="traits"
                    className="character-view__traits info"
                    header="Traits"
                >
                <ul>{_.map(this.props.info, (description, label) => {
                    return <li key={label}>
                        <strong>{label}</strong>
                        <MDReactComponent
                            text={description || ''}
                            />
                    </li>;
                })}
                </ul>
            </Panel>,

            <Panel
                    key="abilities"
                    className="character-view__abilities info"
                    header="Abilities"
                >
                <ul>{_.map(this.props.abilities, (data, label) => {
                    const description = sprintf(
                        data.description,
                        data
                    );
                    return <li key={label}>
                        <strong>{label}</strong>
                        <MDReactComponent
                            text={description || ''}
                            />
                    </li>;
                })}
                </ul>
            </Panel>
        ];
    }
}

export const CharacterView = BaseViewWrapper(
    CharactersView, viewConfig
);

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        CharactersView, viewConfig, "character"
    ),
    ['alignments', 'languages', 'statistics', 'skills', 'genders'],
    'items',
    {
        'languages': '_languages',
        'skills': '_skills',
        'statistics': '_statistics',
    }
);
