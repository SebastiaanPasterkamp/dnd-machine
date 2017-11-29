import React from 'react';
import {Link} from 'react-router-dom';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import ArmorLinks from '../components/ArmorLinks.jsx';
import Bonus from '../components/Bonus.jsx';
import Damage from '../components/Damage.jsx';
import Reach from '../components/Reach.jsx';
import Coinage from '../components/Coinage.jsx';

class ArmorHeader extends LazyComponent
{
    render() {
        return <thead>
            <tr>
                <th>{this.props.name}</th>
                <th>Armor</th>
                <th>Cost</th>
                <th>Properties</th>
                <th>Actions</th>
            </tr>
        </thead>
    }
};

class ArmorFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan="4"></td>
                <td>
                    <ArmorLinks
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
        return <tr
                data-name={this.props.name}>
            <td>
                {this.props.name}<br/>
                <i>({this.props.type})</i>
            </td>
            <td>
                {this.props.value}
                {this.props.formula}
                {this.props.bonus || null
                    ? <Bonus bonus={this.props.bonus} />
                    : null
                }
            </td>
            <td>{this.props.cost
                ? <Coinage {...this.props.cost} extended="1" />
                : null
            }</td>
            <td>
                <ul>
                    {this.props.weight || null
                        ? <li key="weight">
                            <strong>Weight:</strong>
                            &nbsp;
                            {this.props.weight.lb}
                            lb.
                            </li>
                        : null
                    }
                    {this.props.requirements && this.props.requirements.strength || null
                        ? <li key="requirements">
                            <strong>Strength:</strong>
                            &nbsp;
                            {this.props.requirements.strength}
                            </li>
                        : null
                    }
                    {this.props.disadvantage || false
                        ? <li key="disadvantage">
                            <strong>Stealth:</strong>
                            &nbsp;
                            Disadvantage
                            </li>
                        : null
                    }
                </ul>
            </td>
            <td>{this.props.id != null ?
                <ArmorLinks
                    buttons={['view', 'edit']}
                    armor_id={this.props.id}
                    />
                : null
            }</td>
        </tr>
    }
};

class ArmorTable extends LazyComponent
{
    shouldDisplayRow(pattern, weapon) {
        return (
            (weapon.name && weapon.name.search(pattern) >= 0)
        );
    }

    render() {
        if (this.props.armor == null) {
            return null;
        }
        let pattern = new RegExp(this.props.search || '', "i");

        return <div>
            <h2 className="icon fa-shield">Armor</h2>

            <table className="nice-table condensed bordered responsive">
                <ArmorHeader />
                <tbody key="tbody">
                    {_.map(this.props.armor, (armor) => {
                        return this.shouldDisplayRow(pattern, armor)
                            ? <ArmorRow
                                key={armor.id}
                                {...armor}
                                />
                            : null;
                    })}
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
    ['search']
);
