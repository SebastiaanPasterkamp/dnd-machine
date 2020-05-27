import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
} from 'lodash/fp';

import { memoize } from '../../utils';

import ListsToItemsWrapper from '../../hocs/ListsToItemsWrapper';

import ControlGroup from '../ControlGroup';
import FieldSet from '../FieldSet';
import InputField from '../InputField';
import MarkdownTextField from '../MarkdownTextField';
import SingleSelect from '../SingleSelect';
import ToggleSwitch from '../ToggleSwitch';
import TagContainer from '../TagContainer';

import ListFilter from './components/ListFilter';

import { uuidv4 } from './utils';
const ItemizedListFilter = ListsToItemsWrapper(ListFilter, 'items');
const ListTagContainer = ListsToItemsWrapper(TagContainer, 'items');


export class ObjectListOption extends React.Component
{
    optionType = 'objectlist';

    objectListOptions = [
        {id: "armor", name: "Armor"},
        {id: "armor_types", name: "Armor types"},
        {id: "gear", name: "Gear"},
        {id: "humanoid_types", name: "Humanoid types"},
        {id: "languages", name: "Languages"},
        {id: "monster_types", name: "Monster types"},
        {id: "skills", name: "Skills"},
        {id: "spell", name: "Spells"},
        {id: "statistics", name: "Statistics"},
        {id: "terrain_types", name: "Terrain types"},
        {id: "equipment_types", name: "Tool types"},
        {id: "weapon", name: "Weapons"},
        {id: "weapon_types", name: "Weapon types"},
    ];

    hiddenOptions = [
        {id: false, name: "Everything"},
        {id: true, name: "Nothing"},
    ];

    givenOptions = {
        component: InputField,
        componentProps: {
            type: "text",
        },
        newItem: "auto",
    };

    constructor(props) {
        super(props);
        const { uuid = uuidv4() } = props;
        this.state = { uuid };
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onFormulaChange = this.onFormulaChange.bind(this);
        this.onGivenChange = this.onGivenChange.bind(this);
        this.memoize = memoize.bind(this);
    }

    onFieldChange(field) {
        return this.memoize(field, value => {
            const { uuid } = this.state;
            const { setState } = this.props;
            setState({
                type: this.optionType,
                uuid,
                [field]: value,
            });
        });
    }

    onFormulaChange(field) {
        return this.memoize(field, value => {
            const { uuid } = this.state;
            const { setState } = this.props;
            const state = {
                type: this.optionType,
                uuid,
                [field]: undefined,
                [`${field}_formula`]: undefined,
            };
            if (value.match(/^\d+$/)) {
                state[field] = parseInt(value);
            } else if (value) {
                state[`${field}_formula`] = value;
            }
            setState(state);
        });
    }

    onGivenChange(given) {
        const { uuid } = this.state;
        const { setState } = this.props;
        setState({
            type: this.optionType,
            uuid,
            given,
        });
    }

    render() {
        const {
            name, description, path, list, given, multiple,
            add_formula, add,
            replace_formula, replace,
            limit_formula, limit,
            hidden_formula, hidden,
            filter, canBeHidden,
        } = this.props;

        return (
            <FieldSet label="Object list option">
                <ControlGroup label="Path">
                    <InputField
                        placeholder="Path..."
                        value={path}
                        type="text"
                        setState={this.onFieldChange('path')}
                    />
                </ControlGroup>

                {canBeHidden ? (
                    <ControlGroup labels={["Display", "Formula"]}>
                        <SingleSelect
                            items={this.hiddenOptions}
                            selected={hidden_formula ? null : hidden}
                            disabled={!!hidden_formula}
                            emptyLabel="Conditionally"
                            setState={this.onFieldChange('hidden')}
                        />
                        <InputField
                            placeholder="character.level < 5"
                            value={hidden_formula}
                            setState={this.onFieldChange('hidden_formula')}
                            disabled={hidden}
                        />
                    </ControlGroup>
                ) : null}

                {!(canBeHidden && hidden) ? (
                    <ControlGroup label="Label">
                        <InputField
                            placeholder="Label..."
                            value={name}
                            type="text"
                            setState={this.onFieldChange('name')}
                        />
                    </ControlGroup>
                ) : null}

                {!(canBeHidden && hidden) ? (
                    <ControlGroup label="Description">
                        <MarkdownTextField
                            placeholder="Description..."
                            value={description}
                            className="small"
                            setState={this.onFieldChange('description')}
                        />
                    </ControlGroup>
                ) : null}

                <ControlGroup label="Lists">
                    <TagContainer
                        items={this.objectListOptions}
                        value={list}
                        setState={this.onFieldChange('list')}
                    />
                </ControlGroup>

                {!(canBeHidden && hidden) && list.length ? (
                    <ControlGroup
                        labels={[
                            add_formula ? "Add formula" : "Add",
                            limit_formula ? "Limit formula" : "Limit",
                            replace_formula ? "Replace formula" : "Replace",
                        ]}
                    >
                        <InputField
                            placeholder="Add..."
                            value={add_formula || add || ''}
                            disabled={!!(limit || limit_formula)}
                            setState={this.onFormulaChange('add')}
                        />
                        <InputField
                            placeholder="Limit..."
                            value={limit_formula || limit || ''}
                            disabled={!!(add || add_formula)}
                            setState={this.onFormulaChange('limit')}
                        />
                        <InputField
                            placeholder="Replace..."
                            value={replace_formula || replace || ''}
                            setState={this.onFormulaChange('replace')}
                        />
                    </ControlGroup>
                ) : null}

                {!(canBeHidden && hidden)
                    && list.length
                    && (add || add_formula || replace || replace_formula || limit || limit_formula) ? (
                    <FieldSet label="Filter">
                        <ItemizedListFilter
                            key={list}
                            list={list}
                            filter={filter}
                            setState={this.onFieldChange('filter')}
                        />
                    </FieldSet>
                ) : null}

                <ControlGroup label="Given">
                    <ListTagContainer
                        key={list}
                        list={list}
                        value={given}
                        multiple={multiple}
                        objects={true}
                        setState={this.onGivenChange}
                        filterable={true}
                    />
                </ControlGroup>

                <ToggleSwitch
                    checked={multiple}
                    onChange={this.onFieldChange('multiple')}
                    label="Can have duplicates in the same list (multiple)"
                />
            </FieldSet>
        );
    }
};

ObjectListOption.propTypes = {
    type: PropTypes.oneOf(['objectlist']),
    path: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.string),
    add_formula: PropTypes.string,
    add: PropTypes.number,
    limit_formula: PropTypes.string,
    limit: PropTypes.number,
    replace_formula: PropTypes.string,
    replace: PropTypes.number,
    hidden_formula: PropTypes.string,
    hidden: PropTypes.bool,
    filter: PropTypes.arrayOf(PropTypes.object),
    given: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string,
        id: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        name: PropTypes.string,
    })),
    setState: PropTypes.func.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    multiple: PropTypes.bool,
    canBeHidden: PropTypes.bool,
};

ObjectListOption.defaultProps = {
    type: 'objectlist',
    given: [],
    list: [],
    add_formula: '',
    add: 0,
    limit_formula: '',
    limit: 0,
    replace_formula: '',
    replace: 0,
    hidden_formula: '',
    hidden: false,
    filter: [],
    multiple: false,
    name: '',
    description: '',
    canBeHidden: true,
};

export default ObjectListOption;
