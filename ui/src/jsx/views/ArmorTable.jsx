import React from 'react';
import {Link} from 'react-router-dom';

import ItemStore from '../mixins/ItemStore.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
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
                    <Link
                        to={"/items/armor/new"}
                        className="nice-btn-alt icon fa-plus">
                        New
                    </Link>
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
            <td>{this.props.name}</td>
            <td>
                {this.props.value}
                {this.props.formula}
                {this.bonus}
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
                <Link
                    to={"/items/armor/edit/" + this.props.id}
                    className="nice-btn-alt icon fa-pencil">
                    Edit
                </Link> : null
            }</td>
        </tr>
    }
};

class ArmorBody extends LazyComponent
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
                return <ArmorRow key={item.id} {...item}/>
            })}
        </tbody>;
    }
};

class ArmorTable extends LazyComponent
{
    render() {
        let pattern = new RegExp(this.props.search, "i");
        return <div>
            <h2 className="icon fa-shield">Armor</h2>

            <table className="nice-table condensed bordered responsive">
                {this.props.armor
                    .map((set, key) => {
                        return [
                            <ArmorHeader
                                key="header"
                                name={set.name}/>,
                            <ArmorBody
                                key={set.name}
                                pattern={pattern}
                                {...set}/>
                        ];
                    })
                }
                <ArmorFooter />
            </table>
        </div>
    }
}

export default ItemStore(ArmorTable, ['armor', 'search'], 'items');
