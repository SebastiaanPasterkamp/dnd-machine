import React from 'react';
import Reflux from 'reflux';

import LazyComponent from '../components/LazyComponent.jsx';
import listDataActions from '../actions/listDataActions.jsx';
import DataStore from '../stores/dataStore.jsx';

class LanguageHeader extends React.Component
{
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <tr>
            <th>Language</th>
            <th>Speakers</th>
            <th>Script</th>
        </tr>
    }
}

class LanguageRow extends LazyComponent
{
    render() {
        return <tr
                data-name={this.props.name}>
            <td>{this.props.label}</td>
            <td>{this.props.speakers}</td>
            <td>{this.props.script}</td>
        </tr>
    }
};

class LanguageTable extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.store = DataStore;
        this.storeKeys = ['languages', 'search'];
    }

    componentDidMount() {
        if (!this.state.languages.length) {
            listDataActions.fetchItems('languages');
        }
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
        return <div>
            <h2 className="icon fa-language">Languages</h2>
            <table className="nice-table condensed bordered responsive">
                <thead key="thead"><LanguageHeader/></thead>
                <tbody key="tbody">
                    {this.state.languages
                        .filter((row) => this.filterRow(pattern, row))
                        .map((row, key) => {
                            return <LanguageRow key={key} {...row}/>
                        })
                    }
                </tbody>
            </table>
        </div>;
    }
}

export default LanguageTable;