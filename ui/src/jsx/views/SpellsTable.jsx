import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

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
        const {
            name, level, classes, school, range, casting_time,
            duration, components, cost, description
        } = this.props;

        return <tr data-name={name}>
            <td>{name}</td>
            <td>
                <ul className="nice-menu stacked">
                    <li>
                        <strong>Level:</strong>&nbsp;
                        {level}
                    </li>
                    <li>
                        <strong>Classes:</strong>&nbsp;
                        {classes.join(', ')}
                    </li>
                    <li>
                        <strong>School:</strong>&nbsp;
                        {school}
                    </li>
                    <li>
                        <strong>Range:</strong>&nbsp;
                        <Reach distance={range} />
                    </li>
                    <li>
                        <strong>Casting Time:</strong>&nbsp;
                        {casting_time}
                    </li>
                    <li>
                        <strong>Duration:</strong>&nbsp;
                        {duration}
                    </li>
                    <li>
                        <strong>Components:</strong>&nbsp;
                        {components.join(', ')}
                    </li>
                    {cost ?
                        <li>
                            <strong>Cost:</strong>&nbsp;
                            {cost}
                        </li>
                        : null
                    }
                </ul>
            </td>
            <td>
                <MDReactComponent
                    text={this.props.description || ''}
                    />
            </td>
        </tr>
    }
};

class SpellsTable extends React.Component
{
    constructor(props) {
        super(props);
        this.levels = _.range(0, 11)
            .map((level) => {
                return {
                    code: level
                        ? level.toString()
                        : 'Cantrip',
                    label: level
                        ? 'Level ' + level
                        : 'Cantrip',
                };
            });
        this.state = {
            classes: [],
            levels: [],
            name: '',
        };
    }

    filterClasses(classes) {
        this.setState({classes});
    }

    filterLevels(levels) {
        this.setState({levels});
    }

    filterName(name) {
        this.setState({name});
    }

    shouldDisplayRow(row, filter={}) {
        return (
            row.name.match(filter.pattern)
            && (
                !filter.classes.length
                || _.intersection(filter.classes, row.classes).length
            )
            && (
                !filter.levels.length
                || _.includes(filter.levels, row.level)
            )
        );
    }

    renderFilters() {
        const {
            classes, levels, name
        } = this.state;

        return <div className="nice-form-horizontal nice-col-4 nice-col-mobile-12">
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
                        value={name}
                        placeholder="Name..."
                        onChange={
                            (e) => this.filterName(e.target.value)
                        } />
                </div>
            </div>
            <div className="nice-form-group">
                <label
                        htmlFor="classes"
                        className="nice-col-3 nice-control-label">
                    Level
                </label>
                <div className="nice-col-9">
                    <MultiSelect
                        id="classes"
                        items={this.props.classes || []}
                        selected={classes}
                        label="All classes"
                        setState={
                            (classes) => this.filterClasses(classes)
                        } />
                </div>
            </div>
            <div className="nice-form-group">
                <label
                        htmlFor="levels"
                        className="nice-col-3 nice-control-label">
                    Level
                </label>
                <div className="nice-col-9">
                    <MultiSelect
                        id="levels"
                        items={this.levels}
                        selected={levels}
                        label="All levels"
                        setState={
                            (levels) => this.filterLevels(levels)
                        } />
                </div>
            </div>
        </div>;
    }

    render() {
        const { search, spells } = this.props;
        const { classes, levels, name } = this.state;

        if (!spells) {
            return null;
        }

        const filter = {
            classes,
            levels,
            pattern: new RegExp(name || search || '', "i"),
        }
        const filtered = _.filter(
            spells,
            (spell) => this.shouldDisplayRow(spell, filter)
        );

        return <div>
            <h2 className="icon fa-magic">Spells</h2>
            {this.renderFilters()}
            <table className="nice-table condensed bordered responsive">
                <thead key="thead">
                    <SpellsHeader/>
                </thead>
                <tbody key="tbody">
                    {_.map(filtered, (spell) => {
                        return <SpellRow
                            key={spell.name}
                            {...spell}
                            />;
                    })}
                </tbody>
            </table>
        </div>;
    }
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        SpellsTable,
        {spells: {group: 'items', type: 'spells'}}
    ),
    ['search', 'magic_schools', 'magic_components', 'classes'],
    'items'
);
