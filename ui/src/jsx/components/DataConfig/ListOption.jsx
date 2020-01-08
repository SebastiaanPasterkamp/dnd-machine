import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
} from 'lodash/fp';

import { memoize } from '../../utils';
import { uuidv4 } from './utils';

import ListsToItemsWrapper from '../../hocs/ListsToItemsWrapper';

import ControlGroup from '../ControlGroup';
import FieldSet from '../FieldSet';
import InputField from '../InputField';
import { ListComponent, DefinitionListComponent } from '../ListComponent';
import MarkdownTextField from '../MarkdownTextField';
import SingleSelect from '../SingleSelect';
import ToggleSwitch from '../ToggleSwitch';
import TagContainer from '../TagContainer';

import ListFilter from './components/ListFilter';

const ListTagContainer = ListsToItemsWrapper(TagContainer, 'items');

export class ListOption extends React.Component
{
    optionType = 'list';

    listOptions = [
        {id: "armor", label: "Armor"},
        {id: "armor_types", label: "Armor types"},
        {id: "humanoid_types", label: "Humanoid types"},
        {id: "languages", label: "Languages"},
        {id: "monster_types", label: "Monster types"},
        {id: "skills", label: "Skills"},
        {id: "spell", label: "Spells"},
        {id: "statistics", label: "Statistics"},
        {id: "terrain_types", label: "Terrain types"},
        {id: "tools", label: "Tools"},
        {id: "tool_types", label: "Tool types"},
        {id: "weapon", label: "Weapons"},
        {id: "weapon_types", label: "Weapon types"},
    ]

    hiddenOptions = [
        {id: false, label: "Everything"},
        {id: true, label: "Nothing"},
    ]

    givenOptions = {
        component: InputField,
        componentProps: {
            type: "text",
        },
        newItem: "auto",
    }

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
        given = map(
            (value) => {
                if (value.match(/^\d+(?:\.\d+)?$/)) {
                    return parseFloat(value);
                }
                return value;
            }
        )(given);
        setState({
            type: this.optionType,
            uuid,
            given,
        });
    }

    render() {
        const {
            label, description, path, list, given, multiple,
            add_formula, add,
            replace_formula, replace,
            limit_formula, limit,
            hidden_formula, hidden,
            filter, canBeHidden,
        } = this.props;

        return (
            <FieldSet label="List option">
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
                            value={label}
                            type="text"
                            setState={this.onFieldChange('label')}
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

                {!(canBeHidden && hidden) ? (
                    <ControlGroup label="Lists">
                        <TagContainer
                            items={this.listOptions}
                            value={list}
                            setState={this.onFieldChange('list')}
                        />
                    </ControlGroup>
                ) : null}

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
                        <ListFilter
                            filter={filter}
                            setState={this.onFieldChange('filter')}
                        />
                    </FieldSet>
                ) : null}

                <ControlGroup label="Given">
                    {list.length ? (
                        <ListTagContainer
                            key={list}
                            list={list}
                            value={given}
                            setState={this.onGivenChange}
                        />
                    ) : (
                        <ListComponent
                            list={given}
                            {...this.givenOptions}
                            setState={this.onGivenChange}
                        />
                    )}
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

ListOption.propTypes = {
    type: PropTypes.oneOf(['list']),
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
    filter: PropTypes.object,
    given: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ])),
    setState: PropTypes.func.isRequired,
    label: PropTypes.string,
    description: PropTypes.string,
    multiple: PropTypes.bool,
    canBeHidden: PropTypes.bool,
};

ListOption.defaultProps = {
    type: 'list',
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
    filter: {},
    multiple: false,
    label: '',
    description: '',
    canBeHidden: true,
};

export default ListOption;
