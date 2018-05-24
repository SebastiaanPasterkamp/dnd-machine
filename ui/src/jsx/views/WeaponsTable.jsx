import React from 'react';
import {Link} from 'react-router-dom';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import Coinage from '../components/Coinage.jsx';
import DiceNotation from '../components/DiceNotation.jsx';
import ListLabel from '../components/ListLabel.jsx';
import Reach from '../components/Reach.jsx';
import WeaponLinks from '../components/WeaponLinks.jsx';

class WeaponsHeader extends React.Component
{
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <thead key="thead">
            <tr>
                <th>Name</th>
                <th>Damage</th>
                <th>Range</th>
                <th>Cost</th>
                <th>Properties</th>
            </tr>
        </thead>;
    }
};

class WeaponsFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan={5}>
                    <WeaponLinks
                        altStyle={true}
                        />
                </td>
            </tr>
        </tbody>
    }
};

class WeaponsRow extends LazyComponent
{
    render() {
        const {
            id, name, type, damage, range, cost, property,
            weapon_properties = [], weapon_types = []
        } = this.props;

        return <tr data-id={id}>
            <th>
                {name}
                <WeaponLinks
                    altStyle={true}
                    weapon_id={id}
                    />
            </th>
            <td><DiceNotation {...damage}/></td>
            <td>{range
                ? <Reach {...range}/>
                : null
            }</td>
            <td>{cost
                ? <Coinage {...cost} extended="1" />
                : null
            }</td>
            <td>
                <ul>
                    <li key="type">
                        <ListLabel
                            items={weapon_types}
                            value={type}
                            />
                    </li>
                    {_.map(property || [], prop => (
                    <li key={prop}>
                        <ListLabel
                            items={weapon_properties}
                            value={prop}
                            />
                    </li>
                    ))}
                </ul>
            </td>
        </tr>
    }
};

class WeaponsTable extends LazyComponent
{
    shouldDisplayRow(pattern, weapon) {
        return (
            (weapon.name && weapon.name.match(pattern))
        );
    }

    render() {
        const {
            weapons, search = '', weapon_properties, weapon_types
        } = this.props;

        if (!weapons) {
            return null;
        }

        let pattern = new RegExp(search, "i");
        const filtered = _.filter(
            weapons,
            (weapon) => this.shouldDisplayRow(pattern, weapon)
        );

        return <div>
            <h2 className="icon fa-cutlery">Weapons</h2>
            <table className="nice-table condensed bordered responsive">
                <WeaponsHeader />
                <tbody key="tbody">
                    {_.map(filtered, (weapon) => (
                        <WeaponsRow
                            key={weapon.id}
                            {...weapon}
                            weapon_properties={weapon_properties}
                            weapon_types={weapon_types}
                            />
                    ))}
                </tbody>
                <WeaponsFooter />
            </table>
        </div>
    }
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        WeaponsTable,
        {weapons: {group: 'items', type: 'weapon'}}
    ),
    ['search', 'weapon_properties', 'weapon_types'],
    'items'
);
