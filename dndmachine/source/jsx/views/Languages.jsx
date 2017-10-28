import React from 'react';
import Reflux from 'reflux';

import listDataActions from '../actions/listDataActions.jsx';
import DataStore from '../stores/dataStore.jsx';

class LanguageTable extends Reflux.Component
{
    constructor (props) {
        super(props);
        this.store = DataStore;
        this.storeKeys = ['languages', 'search'];
    }

    componentDidMount() {
        listDataActions.fetchLanguages();
    }

    renderHeader() {
        return <tr>
            <th>Language</th>
            <th>Speakers</th>
            <th>Script</th>
        </tr>
    }

    renderRow(row, key) {
        return <tr key={key} data-name={row.name}>
            <td>{row.label}</td>
            <td>{row.speakers}</td>
            <td>{row.script}</td>
        </tr>
    }

    filterRow(pattern, row) {
        return (
            (row.label && row.label.search(pattern) >= 0)
            || (row.speakers && row.speakers.search(pattern) >= 0)
            || (row.script && row.script.search(pattern) >= 0)
        );
    }

    render() {
        let pattern = new RegExp(this.state.search, "i");
        return <table className="nice-table condensed bordered responsive">
            <thead key="thead">{this.renderHeader()}</thead>
            <tbody key="tbody">
                {this.state.languages
                    .filter((row, key) => this.filterRow(pattern, row))
                    .map((row, key) => this.renderRow(row, key))
                }
            </tbody>
        </table>;
    }
}

export default LanguageTable;