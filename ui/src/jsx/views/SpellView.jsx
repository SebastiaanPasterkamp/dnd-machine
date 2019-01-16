import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_spell-view.scss';

import BaseViewWrapper from '../hocs/BaseViewWrapper.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import DiceNotation from '../components/DiceNotation.jsx';
import Panel from '../components/Panel.jsx';
import ListLabel from '../components/ListLabel.jsx';
import Reach from '../components/Reach.jsx';
import {SpellLabel} from '../components/SpellLabel.jsx';
import SpellLinks from '../components/SpellLinks.jsx';

const viewConfig = {
    className: 'spell-view',
    icon: 'fa-magic',
    label: 'Spell'
};

export class SpellsView extends React.Component
{
    render() {
        const {
            id, name, description = '', level, casting_time, duration,
            concentration, components = [], magic_components = [],
            cost,  range, school, magic_schools = [], damage,
            classes = [], _classes = []
        } = this.props;

        return <React.Fragment>

            <Panel
                key="information"
                className="spell-view__information info"
                header="Information"
                >
                <tbody>
                    <tr>
                        <th colSpan={2}>
                            { name }
                            <SpellLinks
                                altStyle={true}
                                spell_id={id}
                                omit={['view']}
                                />
                        </th>
                    </tr>
                    <tr>
                        <th>Level</th>
                        <td>{level}</td>
                    </tr>
                    <tr>
                        <th>Casting Time</th>
                        <td>{casting_time}</td>
                    </tr>
                    <tr>
                        <th>Duration:</th>
                        <td>{duration}</td>
                    </tr>
                    <tr>
                        <th>Concentration:</th>
                        <td>{concentration ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                        <th>Range</th>
                        <td>
                            <Reach
                                distance={range}
                            />
                        </td>
                    </tr>
                    {damage && damage.dice_count ? <tr>
                        <th>Damage</th>
                        <td>
                            <DiceNotation {...damage}/>
                        </td>
                    </tr> : null}
                    <tr>
                        <th>School</th>
                        <td>
                            <ListLabel
                                items={magic_schools}
                                value={school}
                                tooltip={true}
                                />
                        </td>
                    </tr>
                    {components.length ? <tr>
                        <th>Components</th>
                        <td className="spell-view__properties">
                            {_.map(components, (component) => (
                                <ListLabel
                                    key={component}
                                    items={magic_components}
                                    value={component}
                                    tooltip={true}
                                    />
                            ))}
                        </td>
                    </tr> : null}
                    {cost ? <tr>
                        <th>Cost</th>
                        <td>{cost}</td>
                    </tr> : null}
                    {classes.length ? <tr>
                        <th>Classes</th>
                        <td className="spell-view__properties">
                            {_.map(classes, _class => (
                                <ListLabel
                                    key={_class}
                                    items={_classes}
                                    value={_class}
                                    tooltip={true}
                                    />
                            ))}
                        </td>
                    </tr> : null}
                </tbody>
            </Panel>

            <Panel
                key="description"
                className="spell-view__description info"
                header="Description"
                >
                <MDReactComponent
                    text={description}
                    />
            </Panel>

        </React.Fragment>;
    }
};

export const SpellView = BaseViewWrapper(
    SpellsView, viewConfig
);

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        SpellsView, viewConfig, "spell", "items"
    ),
    [
        "magic_components",
        "magic_schools",
        "classes",
    ],
    'items',
    {
        'classes': '_classes'
    }
);
