import React from 'react';
import {Link} from 'react-router-dom';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import Coinage from '../components/Coinage.jsx';
import Damage from '../components/Damage.jsx';
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
                <th>Actions</th>
            </tr>
        </thead>
    }
};

class WeaponsFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan="5"></td>
                <td>
                    <WeaponLinks
                        altStyle={true}
                        buttons={['new']}
                        />
                </td>
            </tr>
        </tbody>
    }
};

class WeaponsRow extends LazyComponent
{
    constructor(props) {
        super(props);
        this.properties = [
            {'code': 'ammunition', 'label': 'Ammunition'},
            {'code': 'finesse', 'label': 'Finesse'},
            {'code': 'heavy', 'label': 'Heavy'},
            {'code': 'light', 'label': 'Light'},
            {'code': 'loading', 'label': 'Loading'},
            {'code': 'reach', 'label': 'Reach'},
            {'code': 'special', 'label': 'Special'},
            {'code': 'thrown', 'label': 'Thrown'},
            {'code': 'two-handed', 'label': 'Two-Handed'},
            {'code': 'versatile', 'label': 'Versatile'},
        ];
    }

    render() {
        return <tr
                data-name={this.props.name}>
            <td>
                {this.props.name}<br/>
                <i>({this.props.type})</i>
            </td>
            <td><Damage {...this.props.damage}/></td>
            <td>{this.props.range
                ? <Reach {...this.props.range}/>
                : null
            }</td>
            <td>{this.props.cost
                ? <Coinage {...this.props.cost} extended="1" />
                : null
            }</td>
            <td>{this.props.property
                ? <ul>{this.properties.map((prop) => {
                    return _.indexOf(this.props.property, prop.code) >= 0
                        ? <li key={prop.code}>{prop.label}</li>
                        : null
                })}</ul>
                : null
            }</td>
            <td>{this.props.id != null ?
                <WeaponLinks
                    altStyle={true}
                    buttons={['view', 'edit']}
                    weapon_id={this.props.id}
                    />
                : null
            }</td>
        </tr>
    }
};

class WeaponsTable extends LazyComponent
{
    shouldDisplayRow(pattern, weapon) {
        return (
            (weapon.name && weapon.name.search(pattern) >= 0)
        );
    }

    render() {
        if (this.props.weapons == null) {
            return null;
        }
        let pattern = new RegExp(this.props.search || '', "i");

        return <div>
            <h2 className="icon fa-cutlery">Weapons</h2>
            <table className="nice-table condensed bordered responsive">
                <WeaponsHeader />
                <tbody key="tbody">
                    {_.map(this.props.weapons, (weapon) => {
                        return this.shouldDisplayRow(pattern, weapon)
                            ? <WeaponsRow
                                key={weapon.id}
                                {...weapon}
                                />
                            : null;
                    })}
                </tbody>
                <WeaponsFooter />
            </table>
        </div>
    }
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        WeaponsTable,
        {weapons: {group: 'items', type: 'weapons'}}
    ),
    ['search']
);
