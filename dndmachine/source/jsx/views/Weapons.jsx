import React from 'react';
import Reflux from 'reflux';

import listDataActions from '../actions/listDataActions.jsx';
import DataStore from '../stores/dataStore.jsx';

class WeaponsTable extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.store = DataStore;
        this.storeKeys = ['weapons', 'search'];
    }

    componentDidMount() {
        listDataActions.fetchWeapons();
    }

    renderHeader(key, title) {
        return <thead key={"thead-" + key}>
            <tr>
                <th>{title}</th>
                <th>Damage</th>
                <th>Range</th>
                <th>Cost</th>
                <th>Properties</th>
            </tr>
        </thead>
    }

    renderRow(key, row) {
        return <tr key={key} data-name={row.name}>
            <td>{row.name}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    }

    renderBody(key, set, pattern) {
        return <tbody key={"tbody-" + key}>
            {set.items
                .filter((row, key) => this.filterRow(pattern, row))
                .map((row, key) => this.renderRow(key, row))
            }
        </tbody>
    }

    filterRow(pattern, row) {
//         return row;
        return (
            (row.name && row.name.search(pattern) >= 0)
        );
    }

    render() {
        let pattern = new RegExp(this.state.search, "i");
        return <div>
            <h2 className="icon fa-cutlery">Weapons</h2>
            <table className="nice-table condensed bordered responsive">
                {this.state.weapons
                    .map((set, key) => {return [
                        this.renderHeader(key, set.name),
                        this.renderBody(key, set, pattern)
                    ]})
                }
            </table>
        </div>
    }
}

export default WeaponsTable;