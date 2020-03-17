import React from 'react';
import PropTypes from 'prop-types';
import {
    concat,
    countBy,
    find,
    findIndex,
    filter,
    forEach,
    includes,
    isPlainObject,
    map,
    omitBy,
    sumBy,
    uniq,
    without,
} from 'lodash/fp';

import {
    BaseTagContainer,
    Tag,
    TagBadge,
} from '../../BaseTagContainer';
import SingleSelect from '../../SingleSelect';

import { memoize } from '../../../utils';

import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper';
import ListsToItemsWrapper from '../../../hocs/ListsToItemsWrapper';
import MatchesFilters from '../utils/MatchesFilters';

export class ObjectListPropertySelect extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            showSelect: false,
            disabled: true,
        };
        this.memoize = memoize.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const { added, removed, given, current, add, limit, replace } = props;
        const cntAdded = sumBy(a => a.count || 1, added);
        const cntCurrent = sumBy(c => c.count || 1, current);
        const cntRemoved = sumBy(r => r.count || 1, removed);

        const showSelect = (cntAdded - cntRemoved) < add || cntCurrent < limit;
        const disabled = cntRemoved >= replace;

        if (showSelect !== state.showSelect || disabled !== state.disabled) {
            return { showSelect, disabled };
        }
        return null;
    }

    getNeedle(item) {
        const { type, id } = item || {};
        return omitBy(
            (value) => value === undefined
        )({type, id});
    }

    increase(item, set) {
        const { multiple } = this.props;
        const needle = this.getNeedle(item);

        const idx = findIndex(needle, set);
        if (idx >= 0) {
            return [
                ...set.slice(0, idx),
                {...set[idx], ...item, count: multiple ? set[idx].count + 1 : undefined},
                ...set.slice(idx + 1),
            ];
        }

        return [...set, {...item, count: multiple ? 1 : undefined}];
    }

    decrease(item, set) {
        const { multiple } = this.props;
        const needle = this.getNeedle(item);

        const idx = findIndex(needle, set);
        if (multiple && set[idx].count > 1) {
            return [
                ...set.slice(0, idx),
                {...set[idx], ...item, count: set[idx].count - 1},
                ...set.slice(idx + 1),
            ];
        }

        return [
            ...set.slice(0, idx),
            ...set.slice(idx + 1),
        ];
    }

    onDelete(item) {
        const { type, id } = item;
        const key = `delete-${type}-${id}`;
        const needle = this.getNeedle(item);

        return this.memoize(key, () => {
            const { added, removed, replace, setState } = this.props;
            const cntRemoved = sumBy(r => r.count || 1, removed);

            const state = { added, removed };
            if (find(needle, added)) {
                state.added = this.decrease(item, added);
            } else if (cntRemoved < replace) {
                state.removed = this.increase(item, removed);
            }

            setState(state);
        });
    }

    onAdd(item) {
        const { items, added, removed, setState } = this.props;
        const needle = this.getNeedle(item);

        const state = { added, removed };
        if (find(needle, removed)) {
            state.removed = this.decrease(item, removed);
        } else {
            state.added = this.increase(item, added);
        }

        setState(state);
    }

    getValue() {
        const {
            added, removed, items, current, given, replace, uuid
        } = this.props;
        const { disabled } = this.state;

        return map(
            (item) => {
                const needle = this.getNeedle(item);

                const isAdded = find(needle, added) !== undefined;
                const isGiven = find(needle, given) !== undefined;
                const isRemoved = find(needle, removed) !== undefined;

                return {
                    ...item,
                    color: isAdded ? 'info' : (
                        isRemoved ? 'bad' : (
                            isGiven ? 'good' : (
                                disabled && !isAdded ? null : 'warning'
                            )
                        )
                    ),
                    disabled: (disabled || isGiven) && !isAdded,
                };
            }
        )(current);
    }

    renderSelect() {
        const {
            multiple, items, current, removed,
            filter: filters,
        } = this.props;
        const { showSelect } = this.state;

        if (!items.length) return null;

        if (!showSelect) {
            return null;
        }

        const filtered = filter(
            item => {
                const needle = this.getNeedle(item);
                if (find(needle, removed)) {
                    return true;
                }
                if (!MatchesFilters(item, filters)) {
                    return false;
                }
                if (multiple) {
                    return true;
                }
                if (find(needle, current)) {
                    return false;
                }
                return true;
            }
        )(items);

        if (!filtered.length) return null;

        return (
            <SingleSelect
                emptyLabel="Add..."
                items={filtered}
                setState={this.onAdd}
                objects={true}
                filterable={true}
            />
        );
    }

    render() {
        const { hidden } = this.props;

        if (hidden) {
            return null;
        }

        return (
            <BaseTagContainer>
                {this.renderSelect()}

                {map(
                    tag => (
                        <Tag
                            key={`tag-${tag.type}-${tag.id}`}
                            onDelete={this.onDelete(tag)}
                            {...tag}
                        >
                            {tag.count > 1 ? (
                                <TagBadge>
                                    &times; {tag.count}
                                </TagBadge>
                            ) : null}
                        </Tag>
                    )
                )(this.getValue())}
            </BaseTagContainer>
        );
    }
};

const itemType = {
    id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    type: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    count: PropTypes.number,
};

ObjectListPropertySelect.propTypes = {
    type: PropTypes.oneOf(['objectlist']).isRequired,
    uuid: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        name: PropTypes.string,
        description: PropTypes.string,
    })),
    given: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.shape(itemType),
            PropTypes.string,
            PropTypes.number,
        ]),
    ),
    current: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.shape(itemType),
            PropTypes.string,
            PropTypes.number,
        ]),
    ),
    limit: PropTypes.number,
    added: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.shape(itemType),
            PropTypes.string,
            PropTypes.number,
        ]),
    ),
    removed: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.shape(itemType),
            PropTypes.string,
            PropTypes.number,
        ]),
    ),
    add: PropTypes.number,
    replace: PropTypes.number,
    filter: PropTypes.arrayOf(
        PropTypes.object
    ),
    multiple: PropTypes.bool,
    hidden: PropTypes.bool,
};

ObjectListPropertySelect.defaultProps = {
    added: [],
    removed: [],
    given: [],
    current: [],
    limit: 0,
    add: 0,
    replace: 0,
    multiple: false,
    filter: [],
    items: [],
    hidden: false,
};

export default ListsToItemsWrapper(
    CharacterEditorWrapper(ObjectListPropertySelect),
    'items'
);
