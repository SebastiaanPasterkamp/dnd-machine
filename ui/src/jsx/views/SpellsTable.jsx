import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import listDataActions from '../actions/listDataActions.jsx';
import DataStore from '../stores/dataStore.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import Reach from '../components/Reach.jsx';

class SpellsHeader extends React.Component
{
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <tr>
            <th>Name</th>
            <th>Information</th>
            <th>Description</th>
        </tr>
    }
}

class SpellRow extends LazyComponent
{
    render() {
        return <tr
                data-name={this.props.name}>
            <td>{this.props.name}</td>
            <td>
                <ul className="nice-menu stacked">
                    <li>
                        <strong>Level:</strong>&nbsp;
                        {this.props.level}
                    </li>
                    <li>
                        <strong>Classes:</strong>&nbsp;
                        {this.props.classes.join(', ')}
                    </li>
                    <li>
                        <strong>School:</strong>&nbsp;
                        {this.props.school}
                    </li>
                    <li>
                        <strong>Range:</strong>&nbsp;
                        <Reach distance={this.props.range} />
                    </li>
                    <li>
                        <strong>Casting Time:</strong>&nbsp;
                        {this.props.casting_time}
                    </li>
                    <li>
                        <strong>Duration:</strong>&nbsp;
                        {this.props.duration}
                    </li>
                    <li>
                        <strong>Components:</strong>&nbsp;
                        {this.props.components.join(', ')}
                    </li>
                    {this.props.cost ?
                    <li>
                        <strong>Cost:</strong>&nbsp;
                        {this.props.cost}
                    </li> : null}
                </ul>
            </td>
            <td dangerouslySetInnerHTML={{__html: this.props.description}} />
        </tr>
    }
};

class SpellsTable extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.store = DataStore;
        this.storeKeys = ['spells'];
        this.levels = [{
            code: 'cantrip',
            label: 'Cantrip'
        }];
        for (let level=1; level<10; level++) {
            this.levels.push({
                code: level.toString(),
                label: 'Level ' + level
            });
        }
        this.state = {
            name: '',
            levels: []
        };
    }

    filterName(name) {
        this.setState({
            name: name
        });
    }

    filterLevels(levels) {
        this.setState({
            levels: levels
        });
    }

    componentDidMount() {
        if (!this.state.spells.length) {
            listDataActions.fetchItems('spells');
        }
    }

    filterRow(pattern, row) {
        return (
            (row.name && row.name.search(pattern) >= 0)
            && (
                this.state.levels.length <= 0
                || (row.level && _.includes(this.state.levels, row.level))
            )
        );
    }

    render() {
        let pattern = new RegExp(this.state.name, "i");
        return <div>
            <h2 className="icon fa-magic">Spells</h2>
            <div className="nice-form-horizontal nice-col-4 nice-col-mobile-12">
                <div className="nice-form-group">
                    <label
                            htmlFor="name"
                            className="nice-col-3 nice-control-label">
                        Name
                    </label>
                    <div className="nice-col-9">
                        <input
                            id="name"
                            className="nice-form-control"
                            type="text"
                            value={this.state.name}
                            placeholder="Name..."
                            onChange={
                                (event) => this.filterName(event.target.value)
                            } />
                    </div>
                </div>
                <div className="nice-form-group">
                    <label
                            htmlFor="level"
                            className="nice-col-3 nice-control-label">
                        Level
                    </label>
                    <div className="nice-col-9">
                        <MultiSelect
                            id="level"
                            items={this.levels}
                            label="All levels"
                            callback={
                                (levels) => this.filterLevels(levels)
                            } />
                    </div>
                </div>
            </div>
            <table className="nice-table condensed bordered responsive">
                <thead key="thead"><SpellsHeader/></thead>
                <tbody key="tbody">
                    {this.state.spells
                        .filter((row) => this.filterRow(pattern, row))
                        .map((row, key) => {
                            return <SpellRow key={key} {...row}/>
                        })
                    }
                </tbody>
            </table>
        </div>;
    }
}

export default SpellsTable;