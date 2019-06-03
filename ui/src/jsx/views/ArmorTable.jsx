import React from 'react';
import {
    filter,
    map,
} from 'lodash/fp';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import ArmorLinks from '../components/ArmorLinks.jsx';
import Bonus from '../components/Bonus.jsx';
import Reach from '../components/Reach.jsx';
import Coinage from '../components/Coinage.jsx';
import ListLabel from '../components/ListLabel.jsx';
import WeightLabel from '../components/WeightLabel.jsx';

const ArmorHeader = function({ name }) {
    return (
        <thead>
            <tr>
                <th>{name}</th>
                <th>Armor</th>
                <th>Cost</th>
                <th>Properties</th>
            </tr>
        </thead>
    );
};

const ArmorFooter = function() {
    return (
        <tbody>
            <tr>
                <td colSpan={4}>
                    <ArmorLinks altStyle={true} />
                </td>
            </tr>
        </tbody>
    );
};

const ArmorRow = function({
    id, name, type, armor_types, value, formula, bonus,
    cost, weight, requirements, disadvantage,
}) {
    return (
        <tr data-id={id}>
            <th>
                {name}
                <ArmorLinks
                    altStyle={true}
                    id={id}
                />
            </th>
            <td>
                {value}
                {formula}
                {bonus
                    ? <Bonus bonus={bonus} />
                    : null
                }
            </td>
            <td>{cost
                ? <Coinage {...cost} extended={true} />
                : null
            }</td>
            <td>
                <ul>
                    <li key="type">
                        <ListLabel
                            items={armor_types}
                            value={type}
                        />
                    </li>
                    {weight ? (
                        <li key="weight">
                            <strong>Weight:</strong>
                            &nbsp;
                            <WeightLabel {...weight} />
                        </li>
                    ) : null}
                    {requirements && requirements.strength ? (
                        <li key="requirements">
                            <strong>Strength:</strong>
                            &nbsp;
                            {requirements.strength}
                        </li>
                    ) : null}
                    {disadvantage ? (
                        <li key="disadvantage">
                            <strong>Stealth:</strong>
                            &nbsp;
                            Disadvantage
                        </li>
                    ) : null}
                </ul>
            </td>
        </tr>
    );
};

class ArmorTable extends LazyComponent
{
    shouldDisplayRow(pattern, armor) {
        return (
            (armor.name && armor.name.match(pattern))
        );
    }

    render() {
        const { armor, search, armor_types } = this.props;

        const pattern = new RegExp(search, "i");
        const filtered = filter(
            (a) => this.shouldDisplayRow(pattern, a),
            armor
        );

        return <div>
            <h2 className="icon fa-shield">Armor</h2>

            <table className="nice-table condensed bordered responsive">
                <ArmorHeader />
                <tbody key="tbody">
                    {map((armor) => (
                        <ArmorRow
                            key={armor.id}
                            {...armor}
                            armor_types={armor_types}
                        />
                    ))(filtered)}
                </tbody>
                <ArmorFooter />
            </table>
        </div>
    }
}

ArmorTable.defaultProps = {
    armor: {},
    armor_types: [],
};

export default ListDataWrapper(
    ObjectDataListWrapper(
        ArmorTable,
        {armor: {group: 'items', type: 'armor'}}
    ),
    ['search', 'armor_types'],
    'items'
);
