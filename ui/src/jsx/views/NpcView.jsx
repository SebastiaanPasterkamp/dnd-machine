import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_npc-view.scss';

import BaseViewWrapper from '../hocs/BaseViewWrapper.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import Bonus from '../components/Bonus.jsx';
import DiceNotation from '../components/DiceNotation.jsx';
import Panel from '../components/Panel.jsx';
import ListLabel from '../components/ListLabel.jsx';
import NpcLinks from '../components/NpcLinks.jsx';
import StatsBlock from '../components/StatsBlock.jsx';
import TagContainer from '../components/TagContainer.jsx';

export class NpcView extends React.Component
{
    npcLinks = ['view'];

    render() {
        const {
            id, name, location, organization, 'class': _class,
            classes = [], race, races = [], gender, genders = [],
            description = '', alignment, alignments = [], size,
            armor_class, size_hit_dice = [], hit_points, level,
            traits = {}, statistics = {}, _statistics = [],
            languages = [], _languages = [], spell = {}
        } = this.props;

        if (!name) {
            return null;
        }

        const { modifiers = {} } = statistics;

        return <React.Fragment>

            <Panel
                key="description"
                className="npc-view__description info"
                header="Description"
                >
                <thead>
                    <tr>
                        <th colSpan={2}>
                            <h3>{name}</h3>
                            <NpcLinks
                                exclude={this.npcLinks}
                                className="pull-right"
                                id={id}
                            />
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <th>Location</th>
                        <td>{location}</td>
                    </tr>
                    <tr>
                        <th>Organization</th>
                        <td>{organization}</td>
                    </tr>
                    <tr>
                        <th>Race</th>
                        <td>
                            <ListLabel
                                items={races}
                                value={race}
                                tooltip={true}
                                />
                        </td>
                    </tr>
                    <tr>
                        <th>Class</th>
                        <td>
                            <ListLabel
                                items={classes}
                                value={_class}
                                tooltip={true}
                                />
                        </td>
                    </tr>
                    <tr>
                        <th>Gender</th>
                        <td>
                            <ListLabel
                                items={genders}
                                value={gender}
                                tooltip={true}
                                />
                        </td>
                    </tr>
                    <tr>
                        <th>Alignment</th>
                        <td>
                            <ListLabel
                                items={alignments}
                                value={alignment}
                                tooltip={true}
                                />
                        </td>
                    </tr>
                    <tr>
                        <th>Size</th>
                        <td>
                            <ListLabel
                                items={size_hit_dice}
                                value={size}
                                tooltip={true}
                                />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                         <MDReactComponent
                            text={description}
                            />
                        </td>
                    </tr>
                </tbody>
            </Panel>

            <Panel
                key="statistics"
                className="npc-view__statistics info"
                header="Statistics"
                >
                <StatsBlock
                    editBase={false}
                    {...statistics}
                    />
            </Panel>

            <Panel
                key="properties"
                className="npc-view__properties info"
                header="Properties"
                >
                <tbody>
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
                                dice_size={_.get(
                                    size_hit_dice,
                                    {code: size},
                                    {dice_size: 8}
                                ).dice_size}
                                bonus={modifiers.constitution * level}
                                />)
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
            </Panel>

            {traits ? <Panel
                key="traits"
                className="npc-view__traits info"
                header="Traits"
                >
                <tbody>
                {_.map(traits, (desc, name) => (
                    <tr key={name}>
                        <th>{name}</th>
                        <td>
                            <MDReactComponent
                                text={desc || ''}
                                />
                        </td>
                    </tr>
                    ))}
                </tbody>
            </Panel> : null}
        </React.Fragment>;
    }
}

export default ListDataWrapper(
    ListDataWrapper(
        RoutedObjectDataWrapper(
            NpcView, {
                className: 'npc-view',
                icon: 'fa-commenting-o',
                label: 'NPC',
            }, "npc"
        ),
        [
            'alignments',
            'genders',
            'size_hit_dice',
            'statistics',
            'languages'
        ],
        'items',
        {
            'statistics': '_statistics',
            'languages': '_languages',
        }
    ),
    ['races', 'classes'],
    'npc'
);
