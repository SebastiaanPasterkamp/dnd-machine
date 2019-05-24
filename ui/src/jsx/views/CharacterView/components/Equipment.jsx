import React from 'react';
import PropTypes from 'prop-types';
import {
    entries,
    flow,
    countBy,
    isObject,
    map,
} from 'lodash/fp';

import { ArmorLabel } from '../../../components/ArmorLabel';
import CountPrefix from '../../../components/CountPrefix';
import Panel from '../../../components/Panel';
import { WeaponLabel } from '../../../components/WeaponLabel';

const Equipment = function({
    weapons, weapon_properties, weapon_types,
    armor, armor_types, items,
}) {
    return (
        <Panel
            key="equipment"
            className="character-view__equipment info"
            header="Equipment"
        >
            <strong>Weapons</strong>
            <ul>
            {map((weapon) => (
                <li key={weapon.id}>
                    <WeaponLabel
                        weapon_properties={weapon_properties}
                        weapon_types={weapon_types}
                        weapon_id={weapon.id}
                        weapon={weapon}
                    />
                </li>
            ))(weapons)}
            </ul>

            <strong>Armor</strong>
            <ul>
            {map((_armor) => (
                <li key={_armor.id}>
                    <ArmorLabel
                        armor_types={armor_types}
                        armor_id={_armor.id}
                        armor={_armor}
                    />
                </li>
            ))(armor)}
            </ul>

            <strong>Gear</strong>

            <ul>
            {map((itemset) => {
                const gear = countBy(
                    (item) => {
                        if (isObject(item)) {
                            return ( item.label || item.name );
                        }
                        return item;
                    },
                    itemset
                );

                return flow(entries, map(([item, cnt]) => (
                    <li key={item}>
                        <CountPrefix count={cnt}>
                            {item}
                        </CountPrefix>
                    </li>
                )))(gear);
            })(items)}
            </ul>
        </Panel>
    );
};

Equipment.propTypes = {
    weapons: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
        })
    ),
    weapon_properties: PropTypes.array,
    weapon_types: PropTypes.array,
    armor: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
        })
    ),
    armor_types: PropTypes.array,
    items: PropTypes.objectOf(
        PropTypes.array
    ),
};

Equipment.defaultProps = {
    weapons: [],
    weapon_properties: [],
    weapon_types: [],
    armor: [],
    armor_types: [],
    items: {},
};

export default Equipment;
