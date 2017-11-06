import React from 'react';
import Reflux from 'reflux';

import listDataActions from '../actions/listDataActions.jsx';
import DataStore from '../stores/dataStore.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import Damage from '../components/Damage.jsx';
import Reach from '../components/Reach.jsx';
import Coinage from '../components/Coinage.jsx';

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
            </tr>
        </thead>
    }
};

class WeaponsRow extends LazyComponent
{
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
            <td></td>
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

        return [
            <WeaponsHeader
                    key="header"
                    name={this.props.name}/>,
            <tbody key="body">
            {items.map((item, key) => {
                return <WeaponsRow key={key} {...item}/>
            })}
            </tbody>
        ];
    }
};

class WeaponsTable extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.store = DataStore;
        this.storeKeys = ['weapons', 'search'];
    }

    componentDidMount() {
        if (!this.state.weapons.length) {
            listDataActions.fetchItems('weapons');
        }
    }

    render() {
        let pattern = new RegExp(this.state.search, "i");
        return <div>
            <h2 className="icon fa-cutlery">Weapons</h2>
            <table className="nice-table condensed bordered responsive">
                {this.state.weapons
                    .map((set, key) => {
                        return <WeaponsBody
                            key={key}
                            pattern={pattern}
                            {...set}/>
                    })
                }
            </table>
        </div>
    }
}

export default WeaponsTable;