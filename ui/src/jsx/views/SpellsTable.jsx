import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_spells-table.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import ControlGroup from '../components/ControlGroup.jsx';
import DiceNotation from '../components/DiceNotation.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import Pagination from '../components/Pagination.jsx';
import SpellLinks from '../components/SpellLinks.jsx';
import Reach from '../components/Reach.jsx';

class SpellsHeader extends React.Component
{
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <thead key="thead">
            <tr>
                <th>Name</th>
                <th>Information</th>
                <th>Description</th>
            </tr>
        </thead>;
    }
}

class SpellsFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan={3}>
                    <SpellLinks
                        altStyle={true}
                        />
                </td>
            </tr>
        </tbody>
    }
};

class SpellRow extends LazyComponent
{
    render() {
        const {
            id, name, level, range, cost, description, damage, casting_time,
            classes = [], _classes = []
        } = this.props;

        return <tr data-id={id}>
            <th>
                {name}
                <SpellLinks
                    altStyle={true}
                    spell_id={id}
                    />
            </th>
            <td>
                <ul className="nice-menu stacked">
                    <li>
                        <strong>Level:</strong>&nbsp;
                        {level}
                    </li>
                    <li>
                        <strong>Casting time:</strong>&nbsp;
                        {casting_time}
                    </li>
                    <li>
                        <strong>Range:</strong>&nbsp;
                        <Reach distance={range} />
                    </li>
                    {cost ?
                        <li>
                            <strong>Cost:</strong>&nbsp;
                            {cost}
                        </li>
                        : null
                    }
                    {classes.length
                        ? <li className="spells-table--properties">
                            <strong>Classes:</strong>&nbsp;
                            {_.map(classes, _class => (
                                <ListLabel
                                    key={_class}
                                    items={_classes}
                                    value={_class}
                                    tooltip={true}
                                    />
                            ))}
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
        this.levels = _.range(0, 11).map((level) => {
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
            offset: 0,
            limit: 10,
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

    renderPager(total) {
        const {
            offset, limit
        } = this.state;

        return <Pagination
            offset={offset}
            limit={limit}
            total={total}
            setOffset={(offset) => this.setState({offset})}
            />;
    }

    renderFilters() {
        const {
            _classes
        } = this.props;
        const {
            classes, levels, name
        } = this.state;

        return <div className="spells-table--search">
            <ControlGroup label="Name">
                <input
                    id="name"
                    className="nice-form-control"
                    type="text"
                    value={name}
                    placeholder="Name..."
                    onChange={
                        (e) => this.filterName(e.target.value)
                    } />
            </ControlGroup>
            <ControlGroup label="Class">
                <MultiSelect
                    id="classes"
                    items={_classes || []}
                    selected={classes}
                    label="All classes"
                    setState={
                        (classes) => this.filterClasses(classes)
                    } />
            </ControlGroup>
            <ControlGroup label="Level">
                <MultiSelect
                    id="levels"
                    items={this.levels}
                    selected={levels}
                    label="All levels"
                    setState={
                        (levels) => this.filterLevels(levels)
                    } />
            </ControlGroup>
        </div>;
    }

    render() {
        const {
            search, spells, magic_components, magic_schools, _classes
        } = this.props;
        const {
            classes, levels, name, offset, limit
        } = this.state;

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
        const paged = _.slice(filtered, offset, offset + limit);

        return <div className="spells-table">
            <h2 className="icon fa-magic">Spells</h2>
            {this.renderFilters()}
            {this.renderPager(filtered.length)}
            <table className="nice-table condensed bordered responsive">
                <SpellsHeader/>
                <tbody key="tbody">
                    {_.map(paged, (spell) => (
                        <SpellRow
                            key={spell.name}
                            magic_components={magic_components}
                            magic_schools={magic_schools}
                            _classes={_classes}
                            {...spell}
                            />
                    ))}
                </tbody>
                <SpellsFooter />
            </table>
            {this.renderPager(filtered.length)}
        </div>;
    }
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        SpellsTable,
        {spells: {group: 'items', type: 'spell'}}
    ),
    ['search', 'classes'],
    'items',
    {
        'classes': '_classes',
    }
);
