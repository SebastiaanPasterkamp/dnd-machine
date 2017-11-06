import React from 'react';
import Reflux from 'reflux';

import listDataActions from '../actions/listDataActions.jsx';
import DataStore from '../stores/dataStore.jsx';

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
                <th>Requirement</th>
            </tr>
        </thead>
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
            <td>{
                this.props.strength
                ? 'Strength: ' + this.props.strength
                : null
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

        return [
            <ArmorHeader
                    key="header"
                    name={this.props.name}/>,
            <tbody key="body">
            {items.map((item, key) => {
                return <ArmorRow key={key} {...item}/>
            })}
            </tbody>
        ];
    }
};

class ArmorTable extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.store = DataStore;
        this.storeKeys = ['armor', 'search'];
    }

    componentDidMount() {
        if (!this.state.armor.length) {
            listDataActions.fetchItems('armor');
        }
    }

    render() {
        let pattern = new RegExp(this.state.search, "i");
        return <div>
            <h2 className="icon fa-shield">Armor</h2>
            <table className="nice-table condensed bordered responsive">
                {this.state.armor
                    .map((set, key) => {
                        return <ArmorBody
                            key={key}
                            pattern={pattern}
                            {...set}/>
                    })
                }
            </table>
        </div>
    }
}

export default ArmorTable;