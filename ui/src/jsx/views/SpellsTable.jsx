import React from 'react';
import PropTypes from 'prop-types';
import {
    filter,
    includes,
    intersection,
    map,
    range,
    slice,
} from 'lodash/fp';
import MDReactComponent from 'markdown-react-js';

import { memoize } from '../utils';

import '../../sass/_spells-table.scss';

import ListDataWrapper from '../hocs/ListDataWrapper';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper';

import ControlGroup from '../components/ControlGroup';
import DiceNotation from '../components/DiceNotation';
import InputField from '../components/InputField';
import LazyComponent from '../components/LazyComponent';
import ListLabel from '../components/ListLabel';
import MultiSelect from '../components/MultiSelect';
import Pagination from '../components/Pagination';
import SpellLinks from '../components/SpellLinks';
import Reach from '../components/Reach';

const SpellsHeader = function() {
    return (
        <thead key="thead">
            <tr>
                <th>Name</th>
                <th>Information</th>
                <th>Description</th>
            </tr>
        </thead>
    );
};

const SpellsFooter = function() {
    return (
        <tbody>
            <tr>
                <td colSpan={3}>
                    <SpellLinks
                        altStyle={true}
                    />
                </td>
            </tr>
        </tbody>
    );
};

const SpellRow = function({
    id, name, level, range, cost, description, damage, casting_time, duration,
    concentration, classes = [], _classes = []
}) {
    return (
        <tr data-id={id}>
            <th className="spells-table--name">
                {name}
                <SpellLinks altStyle={true} id={id} />
            </th>
            <td className="spells-table--summary">
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
                        <strong>Duration:</strong>&nbsp;
                        {duration}
                    </li>
                    <li>
                        <strong>Concentration:</strong>&nbsp;
                        {concentration ? "Yes" : "No"}
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
                            {map((_class) => (
                                <ListLabel
                                    key={_class}
                                    items={_classes}
                                    value={_class}
                                    tooltip={true}
                                />
                            ))(classes)}
                        </li>
                        : null
                    }
                </ul>
            </td>
            <td className="spells-table--description">
                <MDReactComponent text={description} />
            </td>
        </tr>
    );
};

SpellRow.defaultProps = {
    description: '',
    concentration: false,
    classes: [],
    _classes: [],
};

class SpellsFilter extends React.Component
{
    constructor(props) {
        super(props);

        this.levels = range(0, 11).map((level) => {
            return {
                code: level
                    ? level.toString()
                    : 'Cantrip',
                label: level
                    ? 'Level ' + level
                    : 'Cantrip',
            };
        });

        this.memoize = memoize.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(field) {
        const { setState } = this.props;
        return this.memoize(field, (value) => {
            setState({ [field]: value });
        });
    }

    render() {
        const { classes, levels, name, _classes } = this.props;

        return (
            <div className="spells-table--search">
                <ControlGroup label="Name">
                    <InputField
                        id="name"
                        className="nice-form-control"
                        type="text"
                        value={name}
                        placeholder="Name..."
                        setState={this.onChange('name')}
                    />
                </ControlGroup>
                <ControlGroup label="Class">
                    <MultiSelect
                        id="classes"
                        items={_classes || []}
                        selected={classes}
                        emptyLabel="All classes"
                        setState={this.onChange('classes')}
                    />
                </ControlGroup>
                <ControlGroup label="Level">
                    <MultiSelect
                        id="levels"
                        items={this.levels}
                        selected={levels}
                        emptyLabel="All levels"
                        setState={this.onChange('levels')}
                    />
                </ControlGroup>
            </div>
        );
    }
};

SpellsFilter.defaultProps = {
    classes: [],
    levels: [],
    name: '',
    _classes: [],
};

class SpellsTable extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            classes: [],
            levels: [],
            name: '',
            offset: 0,
            limit: 10,
        };
        this.onSearch = this.onSearch.bind(this);
    }

    onSearch(update) {
        this.setState(update);
    };

    shouldDisplayRow(row, {pattern, classes, levels}) {
        return (
            row.name.match(pattern)
            && (
                !classes.length
                || intersection(classes, row.classes).length
            )
            && (
                !levels.length
                || includes(row.level, levels)
            )
        );
    }

    render() {
        const {
            search, spells, magic_components, magic_schools, _classes
        } = this.props;
        const { classes, levels, name, offset, limit } = this.state;

        if (!spells) {
            return null;
        }

        const filters = {
            classes,
            levels,
            pattern: new RegExp(name || search || '', "i"),
        }
        const filtered = filter(
            (spell) => this.shouldDisplayRow(spell, filters)
        )(spells);
        const paged = slice(offset, offset + limit, filtered);

        return (
            <div className="spells-table">
                <h2 className="icon fa-magic">Spells</h2>
                <SpellsFilter
                    {...this.state}
                    _classes={_classes}
                    setState={this.onSearch}
                />
                <Pagination
                    offset={offset}
                    limit={limit}
                    total={filtered.length}
                    setOffset={(offset) => this.setState({offset})}
                />
                <table className="nice-table condensed bordered responsive">
                    <SpellsHeader/>
                    <tbody key="tbody">
                        {map((spell) => (
                            <SpellRow
                                key={spell.name}
                                magic_components={magic_components}
                                magic_schools={magic_schools}
                                _classes={_classes}
                                {...spell}
                                />
                        ))(paged)}
                    </tbody>
                    <SpellsFooter />
                </table>
                <Pagination
                    offset={offset}
                    limit={limit}
                    total={filtered.length}
                    setOffset={(offset) => this.setState({offset})}
                />
            </div>
        );
    }
}

SpellsTable.propTypes = {
    search: PropTypes.string,
    spells: PropTypes.object,
    magic_components: PropTypes.array,
    magic_schools: PropTypes.array,
    _classes: PropTypes.array,
};

SpellsTable.defaultProps = {
    search: '',
    spells: {},
    magic_components: [],
    magic_schools: [],
    _classes: [],
};

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
