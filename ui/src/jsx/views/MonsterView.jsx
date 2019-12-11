import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_monster-view.scss';

import ListDataWrapper from '../hocs/ListDataWrapper';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper';

import Bonus from '../components/Bonus';
import CampaignLabel from '../components/CampaignLabel';
import ChallengeRating from '../components/ChallengeRating';
import DiceNotation from '../components/DiceNotation';
import LazyComponent from '../components/LazyComponent';
import ListLabel from '../components/ListLabel';
import MonsterLinks from '../components/MonsterLinks';
import Panel from '../components/Panel';
import Reach from '../components/Reach';
import StatsBlock from '../components/StatsBlock';
import TagContainer from '../components/TagContainer';
import TagValueContainer from '../components/TagValueContainer';
import XpRating from '../components/XpRating';

const AttackViewComponent = function({
    name, mode, notation, damage, description,
    average, critical, target, target_methods,
    attack_modes, bonus, spell_save_dc, reach,
    on_hit, on_mis,
}) {
    return (
        <Panel
            className="monster-view__attack info"
            header="Attack"
        >
            <tbody>
                <tr>
                    <th colSpan={2}>
                        <h4>{name}</h4>
                        <MDReactComponent
                            text={description}
                        />
                    </th>
                </tr>
                <tr>
                    <th>Mode</th>
                    <td>
                        <ListLabel
                            items={attack_modes}
                            value={mode}
                        />
                    </td>
                </tr>
                <tr>
                    <th>Attack Notation</th>
                    <td>
                        {_.map(damage, dmg => (
                            <DiceNotation
                                key={dmg.type}
                                {...dmg}
                            />
                        ))}
                    </td>
                </tr>
                <tr>
                    <th>Attack Damage</th>
                    <td>
                        <TagValueContainer
                            value={{average, critical}}
                            disabled={true}
                            items={[
                                {code: 'average', label: 'Average'},
                                {code: 'critical', label: 'Critical'}
                            ]}
                        />
                    </td>
                </tr>
                {bonus ? <tr>
                    <th>Attack Bonus</th>
                    <td>Hit <Bonus bonus={bonus} /></td>
                </tr> : null}
                {spell_save_dc ? <tr>
                    <th>Attack Save DC</th>
                    <td>DC &ge; {spell_save_dc}</td>
                </tr> : null}
                <tr>
                    <th>Target</th>
                    <td>
                        <ListLabel
                            items={target_methods}
                            value={target}
                        />
                    </td>
                </tr>
                <tr>
                    <th>Reach</th>
                    <td>
                        <Reach {...reach} />
                    </td>
                </tr>
                {on_hit ? <tr>
                    <th>On Hit</th>
                    <td>
                        <MDReactComponent
                            text={on_hit}
                        />
                    </td>
                </tr> : null}
                {on_mis ? <tr>
                    <th>On Mis</th>
                    <td>
                        <MDReactComponent
                            text={on_mis}
                        />
                    </td>
                </tr> : null}
            </tbody>
        </Panel>
    );
}

AttackViewComponent.defaultProps = {
    name: '',
    mode: 'melee',
    notation: '',
    damage: [],
    description: '',
    average: 0,
    critical: 0,
    target: 'single',
    bonus: 0,
    spell_save_dc: 0,
    reach: {},
    on_hit: '',
    on_mis: '',
    attack_modes: [],
    target_methods: [],
};

const AttackView = ListDataWrapper(
    AttackViewComponent,
    ['attack_modes', 'target_methods'],
    'items'
);

class MultiAttackView extends LazyComponent
{
    render() {
        const {
            name, description, condition, sequence, attacks, average, critical
        } = this.props;

        return <Panel
            key="description"
            className="monster-view__multiattack info"
            header="Multi Attack"
            >
            <tbody>
                <tr>
                    <th colSpan={2}>
                        <h4>{name}</h4>
                        <MDReactComponent
                            text={description}
                            />
                    </th>
                </tr>
                {condition ? <tr>
                    <th>Condition</th>
                    <td>
                        <MDReactComponent
                            text={condition}
                            />
                    </td>
                </tr> : null}
                <tr>
                    <th>Sequence</th>
                    <td>
                        <TagContainer
                            value={sequence}
                            disabled={true}
                            items={_.map(attacks, (attack) => ({
                                code: attack.name,
                                label: attack.name
                            }))}
                            />
                    </td>
                </tr>
                <tr>
                    <th>Combo Damage</th>
                    <td>
                        <TagValueContainer
                            value={{average, critical}}
                            disabled={true}
                            items={[
                                {code: 'average', label: 'Average'},
                                {code: 'critical', label: 'Critical'}
                                ]}
                            />
                    </td>
                </tr>
            </tbody>
        </Panel>;
    }
}


export class MonsterView extends LazyComponent
{
    render() {
        const {
            id, name, size, type, alignment, level, armor_class,
            description, challenge_rating_precise: cr, xp_rating,
            motion, languages, traits, attacks, multiattack, proficiency,
            statistics, dice_size, hit_points, monster_types,
            size_hit_dice, _languages, alignments, campaign_id,
        } = this.props;

        if (!name) {
            return null;
        }

        return <React.Fragment>
            <Panel
                key="description"
                className="monster-view__description info"
                header="Description"
                >
                <thead>
                    <tr>
                        <th colSpan={2}>
                            <MonsterLinks
                                className="pull-right"
                                id={id}
                            />
                            <h3>{name}</h3>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {campaign_id ? (
                        <tr>
                            <th>Campaign</th>
                            <td>
                                <CampaignLabel id={campaign_id} />
                            </td>
                        </tr>
                    ) : null}
                    <tr>
                        <th>Size</th>
                        <td>
                            <ListLabel
                                items={size_hit_dice}
                                value={size}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>Type</th>
                        <td>
                            <ListLabel
                                items={monster_types}
                                value={type}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>Alignment</th>
                        <td>
                            <ListLabel
                                items={alignments}
                                value={alignment}
                                />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <MDReactComponent
                                text={description || ''}
                                />
                        </td>
                    </tr>
                </tbody>
            </Panel>

            <Panel
                key="properties"
                className="monster-view__properties info" header="Properties"
                >
                <tbody>
                    <tr>
                        <th>Challenge Rating</th>
                        <td>
                            <ChallengeRating
                                challengeRating={cr}
                                precise={true}
                                />
                            &nbsp;/&nbsp;
                            <XpRating
                                xpRating={xp_rating}
                                />
                        </td>
                    </tr>
                    <tr>
                        <th>Proficiency</th>
                        <td>
                            <Bonus
                                bonus={proficiency}
                                />
                        </td>
                    </tr>
                    <tr>
                        <th>Level</th>
                        <td>{level}</td>
                    </tr>
                    <tr>
                        <th>AC</th>
                        <td>{armor_class}</td>
                    </tr>
                    <tr>
                        <th>Hit Points</th>
                        <td>
                            {hit_points}
                            &nbsp;
                            (<DiceNotation
                                dice_count={level}
                                dice_size={dice_size}
                                bonus={statistics.modifiers.constitution * level}
                                />)
                        </td>
                    </tr>
                    <tr>
                        <th>Motion</th>
                        <td>
                            <TagValueContainer
                                value={motion}
                                disabled={true}
                                items={[
                                    {code: 'walk', label: 'Walk'},
                                    {code: 'burrow', label: 'Burrow'},
                                    {code: 'climb', label: 'Climb'},
                                    {code: 'fly', label: 'Fly'},
                                    {code: 'swim', label: 'Swim'}
                                ]}
                                />
                        </td>
                    </tr>
                    <tr>
                        <th>Languages</th>
                        <td>
                            <TagContainer
                                value={languages}
                                disabled={true}
                                items={_languages}
                                />
                        </td>
                    </tr>
                    {!_.isEmpty(traits) ? <tr>
                        <th>Traits</th>
                        <td>
                            <ul>
                            {_.map(traits, (description, name) => (
                                <li key={name}>
                                    <strong>{name}</strong>
                                    <MDReactComponent
                                        text={description || ''}
                                        />
                                </li>
                            ))}
                            </ul>
                        </td>
                    </tr> : null}
                </tbody>
            </Panel>

            <Panel
                    key="statistics"
                    className="monster-view__statistics info"
                    header="Statistics"
                >
                <StatsBlock
                    editBase={false}
                    {...statistics}
                />
            </Panel>

            {_.map(attacks, attack => (
                <AttackView
                    key={attack.name}
                    {...attack}
                    />
            ))}

            {_.map(multiattack, sequence => (
                <MultiAttackView
                    key={sequence.name}
                    {...sequence}
                    attacks={attacks}
                    />
            ))}
        </React.Fragment>
    }
}

MonsterView.defaultProps = {
    description: '',
    level: 1,
    dice_size: 4,
    motion: {},
    languages: [],
    traits: {},
    attacks: [],
    multiattack: [],
    statistics: {
        bare: {},
        bonus: {},
        base: {},
        modifiers: {},
    },
    monster_types: [],
    size_hit_dice: [],
    _languages: [],
    alignments: [],
};

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        MonsterView, {
            className: 'monster-view',
            icon: 'fa-paw',
            label: 'Monster',
        }, "monster"
    ),
    ['alignments', 'size_hit_dice', 'monster_types', 'languages'],
    'items',
    {'languages': '_languages'}
);
