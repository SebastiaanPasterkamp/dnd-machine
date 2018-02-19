import React from 'react';
import {Link} from 'react-router-dom';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import ArmorLinks from '../components/ArmorLinks.jsx';
import Bonus from '../components/Bonus.jsx';
import Reach from '../components/Reach.jsx';
import Coinage from '../components/Coinage.jsx';
import ListLabel from '../components/ListLabel.jsx';

class ArmorHeader extends LazyComponent
{
    render() {
        return <thead>
            <tr>
                <th>{this.props.name}</th>
                <th>Armor</th>
                <th>Cost</th>
                <th>Properties</th>
            </tr>
        </thead>
    }
};

class ArmorFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan={4}>
                    <ArmorLinks
                        altStyle={true}
                        buttons={['new']}
                        />
                </td>
            </tr>
        </tbody>
    }
};

class ArmorRow extends LazyComponent
{
    render() {
        const {
            id, name, type, armor_types = [], value, formula, bonus,
            cost, weight, requirements, disadvantage
        } = this.props;

        return <tr data-id={id}>
            <th>
                {name}
                <ArmorLinks
                    altStyle={true}
                    buttons={['view', 'edit']}
                    armor_id={this.props.id}
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
                    {weight
                        ? <li key="weight">
                            <strong>Weight:</strong>
                            &nbsp;
                            {weight.lb}
                            lb.
                            </li>
                        : null
                    }
                    {requirements && requirements.strength
                        ? <li key="requirements">
                            <strong>Strength:</strong>
                            &nbsp;
                            {requirements.strength}
                            </li>
                        : null
                    }
                    {disadvantage
                        ? <li key="disadvantage">
                            <strong>Stealth:</strong>
                            &nbsp;
                            Disadvantage
                            </li>
                        : null
                    }
                </ul>
            </td>
        </tr>
    }
};

class ArmorTable extends LazyComponent
{
    shouldDisplayRow(pattern, armor) {
        return (
            (armor.name && armor.name.match(pattern))
        );
    }

    render() {
        const {
            armor, search = '', armor_types
        } = this.props;

        if (!armor) {
            return null;
        }

        let pattern = new RegExp(search, "i");
        const filtered = _.filter(
            armor,
            (a) => this.shouldDisplayRow(pattern, a)
        );


        return <div>
            <h2 className="icon fa-shield">Armor</h2>

            <table className="nice-table condensed bordered responsive">
                <ArmorHeader />
                <tbody key="tbody">
                    {_.map(filtered, (armor) => (
                        <ArmorRow
                            key={armor.id}
                            {...armor}
                            armor_types={armor_types}
                            />
                    ))}
                </tbody>
                <ArmorFooter />
            </table>
        </div>
    }
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        ArmorTable,
        {armor: {group: 'items', type: 'armor'}}
    ),
    ['search', 'armor_types'],
    'items'
);
