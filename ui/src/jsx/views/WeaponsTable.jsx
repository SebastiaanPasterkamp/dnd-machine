import React from 'react';
import PropTypes from 'prop-types';
import {
    filter,
    includes,
    intersection,
    map,
} from 'lodash/fp';

import { memoize } from '../utils';

import '../../sass/_weapons-table.scss';

import ListDataWrapper from '../hocs/ListDataWrapper';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper';

import LazyComponent from '../components/LazyComponent';
import ControlGroup from '../components/ControlGroup';
import Coinage from '../components/Coinage';
import DiceNotation from '../components/DiceNotation';
import InputField from '../components/InputField';
import ListLabel from '../components/ListLabel';
import MultiSelect from '../components/MultiSelect';
import Reach from '../components/Reach';
import WeaponLinks from '../components/WeaponLinks';

const WeaponsHeader = function() {
    return (
        <thead key="thead">
            <tr>
                <th>Name</th>
                <th>Damage</th>
                <th>Range</th>
                <th>Cost</th>
                <th>Properties</th>
            </tr>
        </thead>
    );
};

const WeaponsFooter = function() {
    return (
        <tbody>
            <tr>
                <td colSpan={5}>
                    <WeaponLinks altStyle={true} />
                </td>
            </tr>
        </tbody>
    );
};

const WeaponsRow = function({
    id, name, type, damage, range, cost, property,
    weapon_properties, weapon_types,
}) {
    return (
        <tr data-id={id}>
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
                    {map(prop => (
                        <li key={prop}>
                            <ListLabel
                                items={weapon_properties}
                                value={prop}
                            />
                        </li>
                    ))(property)}
                </ul>
            </td>
        </tr>
    );
};

WeaponsRow.defaultProps = {
    property: [],
    weapon_properties: [],
    weapon_types: [],
};

class WeaponsFilter extends React.Component
{
    constructor(props) {
        super(props);

        this.dice_size = map(
            size => ({
                code: size,
                label: size,
            })
        )([4, 6, 8, 10, 12]);

        this.memoize = memoize.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(field) {
        const { setState } = this.props;
        return this.memoize(field, (value) => {
            setState({ [field]: value });
        });
    }

    render() {
        const {
            name, dice_count, dice_size, damage_type, weapon_type,
            weapon_property, weapon_types, damage_types,
            weapon_properties,
        } = this.props;

        return (
            <div className="weapons-table--search">
                <ControlGroup label="Name">
                    <InputField
                        id="name"
                        type="text"
                        value={name}
                        placeholder="Name..."
                        setState={this.onChange('name')}
                    />
                </ControlGroup>
                <ControlGroup label="Properties">
                    <MultiSelect
                        id="properties"
                        items={weapon_properties}
                        selected={weapon_property}
                        emptyLabel="All Properties"
                        setState={this.onChange('weapon_property')}
                    />
                </ControlGroup>
                <ControlGroup label="Weapon Types">
                    <MultiSelect
                        id="weapon-types"
                        items={weapon_types}
                        selected={weapon_type}
                        emptyLabel="All Weapon Types"
                        setState={this.onChange('weapon_type')}
                    />
                </ControlGroup>
                <ControlGroup labels={["Damage", "d", "Type"]}>
                    <InputField
                        type="number"
                        placeholder="Dice count"
                        value={ dice_count }
                        setState={this.onChange('dice_count')}
                    />
                    <MultiSelect
                        items={ this.dice_size }
                        selected={ dice_size }
                        emptyLabel="Dice Sizes"
                        setState={this.onChange('dice_size')}
                    />
                    <MultiSelect
                        id="damage-types"
                        items={ damage_types }
                        selected={ damage_type }
                        emptyLabel="All Damage Types"
                        setState={this.onChange('damage_type')}
                    />
                </ControlGroup>
            </div>
        );
    }
};

WeaponsFilter.defaultProps = {
    property: [],
    damage_types: [],
    weapon_properties: [],
    weapon_types: [],
};

class WeaponsTable extends LazyComponent
{
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            dice_count: '',
            dice_size: [],
            damage_type: [],
            weapon_type: [],
            weapon_property: [],
        };
        this.onSearch = this.onSearch.bind(this);
    }

    onSearch(update) {
        this.setState(update);
    };

    shouldDisplayRow(row, {
        pattern, weapon_type, dice_count, dice_size, damage_type,
        weapon_property,
    }) {
        return (
            row.name.match(pattern)
            && (
                !weapon_type.length
                || includes(weapon_type, row.type)
            )
            && (
                !dice_count
                || dice_count === row.damage.dice_count
            )
            && (
                !dice_size.length
                || includes(dice_size, row.damage.dice_size)
            )
            && (
                !damage_type.length
                || includes(damage_type, row.damage.type)
            )
            && intersection(
                weapon_property,
                row.property
            ).length === weapon_property.length
        );
    }

    render() {
        const {
            weapons, search,
            damage_types, weapon_properties, weapon_types,
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

        const filters = {
            pattern: new RegExp(name || search || '', "i"),
            dice_count,
            dice_size,
            damage_type,
            weapon_type,
            weapon_property,
        }
        const filtered = filter(
            weapon => this.shouldDisplayRow(weapon, filters)
        )(weapons);

        return (
            <div className="weapons-table">
                <h2 className="icon fa-cutlery">Weapons</h2>
                <WeaponsFilter
                    {...this.state}
                    damage_types={damage_types}
                    weapon_properties={weapon_properties}
                    weapon_types={weapon_types}
                    setState={this.onSearch}
                />
                <table className="nice-table condensed bordered responsive">
                    <WeaponsHeader />
                    <tbody key="tbody">
                        {map((weapon) => (
                            <WeaponsRow
                                key={weapon.id}
                                {...weapon}
                                weapon_properties={weapon_properties}
                                weapon_types={weapon_types}
                            />
                        ))(filtered)}
                    </tbody>
                    <WeaponsFooter />
                </table>
            </div>
        );
    }
}

WeaponsTable.propTypes = {
    search: PropTypes.string,
    weapons: PropTypes.objectOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        damage: PropTypes.object,
        versatile: PropTypes.object,
        type: PropTypes.string.isRequired,
        property: PropTypes.arrayOf( PropTypes.string ),
        range: PropTypes.object,
        weight: PropTypes.object,
        cost: PropTypes.object,
        description: PropTypes.string,
    })),
    weapon_properties: PropTypes.array,
    weapon_types: PropTypes.array,
};

WeaponsTable.defaultProps = {
    search: '',
    weapons: {},
    weapon_properties: [],
    weapon_types: [],
};

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
