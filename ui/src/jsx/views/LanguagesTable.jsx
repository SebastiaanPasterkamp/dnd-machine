import React from 'react';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

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
                data-name={this.props.code}>
            <td>{this.props.label}</td>
            <td>{this.props.speakers}</td>
            <td>{this.props.script}</td>
        </tr>
    }
};

class LanguageTable extends LazyComponent
{
    filterRow(pattern, row) {
        return (
            (row.label && row.label.search(pattern) >= 0)
            || (row.speakers && row.speakers.search(pattern) >= 0)
            || (row.script && row.script.search(pattern) >= 0)
        );
    }

    render() {
        if (this.props.languages == null) {
            return null;
        }
        let pattern = new RegExp(this.props.search || '', "i");

        return <div>
            <h2 className="icon fa-language">Languages</h2>
            <table className="nice-table condensed bordered responsive">
                <thead key="thead"><LanguageHeader/></thead>
                <tbody key="tbody">
                    {this.props.languages
                        .filter((row) => this.filterRow(pattern, row))
                        .map((row) => {
                            return <LanguageRow key={row.code} {...row}/>
                        })
                    }
                </tbody>
            </table>
        </div>;
    }
}

export default ListDataWrapper(
    LanguageTable,
    ['languages', 'search'],
    'items'
);
