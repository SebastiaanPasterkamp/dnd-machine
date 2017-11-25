import React from 'react';
import {Link} from 'react-router-dom';

import ItemStore from '../mixins/ItemStore.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import Coinage from '../components/Coinage.jsx';
import Damage from '../components/Damage.jsx';
import Reach from '../components/Reach.jsx';
import WeaponLinks from '../components/WeaponLinks.jsx';

class WeaponsHeader extends LazyComponent
{
    render() {
        return <thead>
            <tr>
                <th>{this.props.name}</th>
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
                        buttons={['new']}
                        weapon_id={this.props.id}
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
            <td>{this.props.name}</td>
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
                    buttons={['view', 'edit']}
                    weapon_id={this.props.id}
                    />
                : null
            }</td>
        </tr>
    }
};

class WeaponsBody extends LazyComponent
{
    filterItem(item) {
        return (
            (item.name && item.name.search(this.props.pattern) >= 0)
        );
    }

    render() {
        let items = this.props.items
            .filter((item, key) => this.filterItem(item));
        if (!items.length) {
            return null
        }

        return <tbody key="body">
            {items.map((item) => {
                return <WeaponsRow key={item.id} {...item}/>
            })}
        </tbody>;
    }
};

class WeaponsTable extends LazyComponent
{
    render() {
        let pattern = new RegExp(this.props.search, "i");

        return <div>
            <h2 className="icon fa-cutlery">Weapons</h2>
            <table className="nice-table condensed bordered responsive">
                {this.props.weapons
                    .map((set, key) => {
                        return [
                            <WeaponsHeader
                                key={"header-" + set.name}
                                name={set.name}/>,
                            <WeaponsBody
                                key={"body-" + set.name}
                                pattern={pattern}
                                {...set}/>
                        ];
                    })
                }
                <WeaponsFooter />
            </table>
        </div>
    }
}

export default ItemStore(WeaponsTable, ['weapons', 'search'], 'items');
