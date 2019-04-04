import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_weapon-view.scss';

import BaseViewWrapper from '../hocs/BaseViewWrapper.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import Coinage from '../components/Coinage.jsx';
import DiceNotation from '../components/DiceNotation.jsx';
import Panel from '../components/Panel.jsx';
import ListLabel from '../components/ListLabel.jsx';
import Reach from '../components/Reach.jsx';
import {WeaponLabel} from '../components/WeaponLabel.jsx';
import WeaponLinks from '../components/WeaponLinks.jsx';

const viewConfig = {
    className: 'weapon-view',
    icon: 'fa-cutlery',
    label: 'Weapon'
};

export class WeaponsView extends React.Component
{
    render() {
        const {
            id, name, damage, versatile, type, weapon_types = [],
            property: properties = [], range = {}, weight = {},
            cost = {}, description, weapon_properties = [],
        } = this.props;

        return <React.Fragment>

            <Panel
                key="information"
                className="weapon-view__information info"
                header="Information"
                >
                <tbody>
                    <tr>
                        <th colSpan={2}>
                            <WeaponLinks
                                className="pull-right"
                                weapon_id={id}
                                omit={['view']}
                                />
                            { name }
                        </th>
                    </tr>
                    <tr>
                        <th>Type:</th>
                        <td>
                            <ListLabel
                                items={weapon_types}
                                value={type}
                                tooltip={true}
                                />

                        </td>
                    </tr>
                    <tr>
                        <th>Damage:</th>
                        <td>
                            {damage && <DiceNotation {...damage} />}
                            {versatile && [
                                ` / `,
                                <DiceNotation {...versatile} />
                            ]}
                        </td>
                    </tr>
                    { !_.isEmpty(properties) && <tr>
                        <th>Attributes:</th>
                        <td className="weapon-view__properties">
                            {_.map(properties, (property) => (
                                <ListLabel
                                    key={property}
                                    items={weapon_properties}
                                    value={property}
                                    tooltip={true}
                                    />
                            ))}
                        </td>
                    </tr> }
                    { !_.isEmpty(range) && <tr>
                        <th>Range</th>
                        <td>
                            <Reach {...range} />
                        </td>
                    </tr> }
                    { !_.isEmpty(weight) && <tr>
                        <th>Weight</th>
                        <td>{ weight.lb || '' } lb.</td>
                    </tr> }
                    { !_.isEmpty(cost) && <tr>
                        <th>Cost</th>
                        <td>
                            <Coinage
                                {...cost}
                                className="nice-form-control"
                                extended="1"
                                />
                        </td>
                    </tr> }
                </tbody>
            </Panel>

            { description && <Panel
                key="description"
                className="weapon-view__description info"
                header="Description"
                >
                <MDReactComponent
                    text={description}
                    />
            </Panel> }

        </React.Fragment>;
    }
};

export const WeaponView = BaseViewWrapper(
    WeaponsView, viewConfig
);

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        WeaponsView, viewConfig, "weapon", "items"
    ),
    [
        "weapon_types",
        "weapon_properties",
        "damage_types",
    ],
    'items'
);
