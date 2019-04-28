import React from 'react';
import {Link} from 'react-router-dom';

import '../../sass/_weapons-table.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import Coinage from '../components/Coinage.jsx';
import DiceNotation from '../components/DiceNotation.jsx';
import InputField from '../components/InputField.jsx';
import ListLabel from '../components/ListLabel.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
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
            weapon_properties = [], weapon_types = [],
        } = this.props;

        return <tr data-id={id}>
            <th>
                {name}
                <WeaponLinks
                    altStyle={true}
                    id={id}
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
    constructor(props) {
        super(props);

        this.dice_size = _.map(
            [4, 6, 8, 10, 12],
            size => ({
                code: size,
                label: size
            })
        );

        this.state = {
            name: '',
            dice_count: '',
            dice_size: [],
            damage_type: [],
            weapon_type: [],
            weapon_property: [],
        };
    }

    shouldDisplayRow(row, filter={}) {
        return (
            row.name.match(filter.pattern)
            && (
                !filter.weapon_type.length
                || _.includes(filter.weapon_type, row.type)
            )
            && (
                !filter.dice_count
                || filter.dice_count == row.damage.dice_count
            )
            && (
                !filter.dice_size.length
                || _.includes(filter.dice_size, row.damage.dice_size)
            )
            && (
                !filter.damage_type.length
                || _.includes(filter.damage_type, row.damage.type)
            )
            && _.intersection(
                filter.weapon_property,
                row.property
            ).length == filter.weapon_property.length
        );
    }

    renderFilters() {
        const {
            weapon_types = [],
            damage_types = [],
            weapon_properties = [],
        } = this.props;
        const {
            name,
            dice_count,
            dice_size,
            damage_type,
            weapon_type,
            weapon_property,
        } = this.state;

        return <div className="weapons-table--search">
            <ControlGroup label="Name">
                <InputField
                    id="name"
                    type="text"
                    value={name}
                    placeholder="Name..."
                    setState={
                        name => this.setState({name})
                    } />
            </ControlGroup>
            <ControlGroup label="Properties">
                <MultiSelect
                    id="properties"
                    items={weapon_properties}
                    selected={weapon_property}
                    emptyLabel="All Properties"
                    setState={
                        weapon_property => this.setState({
                            weapon_property
                        })
                    } />
            </ControlGroup>
            <ControlGroup label="Weapon Types">
                <MultiSelect
                    id="weapon-types"
                    items={weapon_types}
                    selected={weapon_type}
                    emptyLabel="All Weapon Types"
                    setState={
                        weapon_type => this.setState({
                            weapon_type
                        })
                    } />
            </ControlGroup>
            <ControlGroup labels={["Damage", "d", "Type"]}>
                <InputField
                    type="number"
                    placeholder="Dice count"
                    value={ dice_count || '' }
                    setState={
                        dice_count => this.setState({dice_count})
                    }
                    />
                <MultiSelect
                    items={ this.dice_size }
                    selected={ dice_size }
                    emptyLabel="Dice Sizes"
                    setState={
                        dice_size => this.setState({
                            dice_size
                        })
                    } />
                <MultiSelect
                    id="damage-types"
                    items={ damage_types }
                    selected={ damage_type }
                    emptyLabel="All Damage Types"
                    setState={
                        damage_type => this.setState({
                            damage_type
                        })
                    } />
            </ControlGroup>
        </div>;
    }

    render() {
        const {
            weapons = [], search = '',
            weapon_properties = [], weapon_types = [],
        } = this.props;
        const {
            name,
            dice_count,
            dice_size,
            damage_type,
            weapon_type,
            weapon_property,
        } = this.state;

        if (!weapons) {
            return null;
        }

        const filter = {
            pattern: new RegExp(name || search || '', "i"),
            dice_count,
            dice_size,
            damage_type,
            weapon_type,
            weapon_property,
        }
        const filtered = _.filter(
            weapons,
            weapon => this.shouldDisplayRow(weapon, filter)
        );

        return <div className="weapons-table">
            <h2 className="icon fa-cutlery">Weapons</h2>
            {this.renderFilters()}
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
    [
        'search',
        'damage_types',
        'weapon_properties',
        'weapon_types',
    ],
    'items'
);
