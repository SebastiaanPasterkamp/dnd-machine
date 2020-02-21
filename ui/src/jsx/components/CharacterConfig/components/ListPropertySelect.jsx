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

export class ListPropertySelect extends React.Component
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
        const { added, removed, given, current, objectlist, add, limit, replace } = props;
        const cntAdded = objectlist ? sumBy('count', added) : added.length;
        const cntCurrent = objectlist ? sumBy('count', current) : current.length;
        const cntRemoved = objectlist ? sumBy('count', removed) : removed.length;

        const showSelect = (cntAdded - cntRemoved) < add || cntCurrent < limit;
        const disabled = cntRemoved >= replace;

        if (showSelect !== state.showSelect || disabled !== state.disabled) {
            return { showSelect, disabled };
        }
        return null;
    }

    increase(item, set) {
        const { multiple, objectlist } = this.props;
        const { type, id } = item;

        if (!objectlist) {
            if (multiple) {
                return [...set, id];
            }
            return uniq([...set, id]);
        }

        const idx = findIndex({ type, id }, set);
        if (idx >= 0) {
            return [
                ...set.slice(0, idx),
                {...set[idx], ...item, count: multiple ? set[idx].count + 1 : 1},
                ...set.slice(idx + 1),
            ];
        }

        return [...set, {...item, count: 1}];
    }

    decrease(item, set) {
        const { multiple, objectlist } = this.props;
        const { type, id } = item;

        if (!objectlist) {
            const idx = findIndex(id, set);
            if (multiple && idx >= 0) {
                return [
                    ...set.slice(0, idx),
                    ...set.slice(idx + 1),
                ];
            }

            return without([id], set);
        }

        const idx = findIndex({ type, id }, set);
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
        const { objectlist } = this.props;
        const { type, id } = item;
        const key = objectlist ? `delete-${type}-${id}` : `delete-${id}`;
        const needle = objectlist ? { type, id } : i => i === id;

        return this.memoize(key, () => {
            const { added, removed, replace, setState } = this.props;
            const cntRemoved = objectlist ? sumBy('count', removed) : removed.length;

            const state = { added, removed };
            if (find(needle, added)) {
                state.added = this.decrease(item, added);
            } else if (cntRemoved < replace) {
                state.removed = this.increase(item, removed);
            }

            setState(state);
        });
    }

    onAdd(id) {
        const { added, removed, objectlist, setState } = this.props;
        const item = { id };
        const needle = objectlist ? item : i => i === id;

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
            added, removed, items, objectlist, current, given, replace
        } = this.props;
        const { disabled } = this.state;

        return map(
            (item) => {
                const { type, id } = objectlist ? item : { id: item };
                const needle = objectlist ? { type, id } : i => i === item;

                const isAdded = find(needle, added) !== undefined;
                const isGiven = find(needle, given) !== undefined;
                const isRemoved = find(needle, removed) !== undefined;

                const retval = objectlist ? item : (
                    items.length
                        ? find({ type, id }, items)
                          || find({ id }, items)
                          || find({ type, code: id }, items)
                          || find({ code: id }, items)
                          || { id, type, name: id, count: 1 }
                        : { id, name: id, count: 1 }
                );

                return {
                    ...retval,
                    id: retval.id || retval.code,
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
            item => (
                find({ type: item.type, id: item.id }, removed )
                || (
                    MatchesFilters(item, filters)
                    && (
                        multiple
                        || !find({ type: item.type, id: item.id }, current )
                    )
                )
            )
        )(items);

        if (!filtered.length) return null;

        return (
            <SingleSelect
                emptyLabel="Add..."
                items={filtered}
                setState={this.onAdd}
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
                                    &cross; {tag.count}
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
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string,
};

ListPropertySelect.propTypes = {
    type: PropTypes.oneOf(['list']).isRequired,
    uuid: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        code: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        name: PropTypes.string,
        label: PropTypes.string,
        description: PropTypes.string,
    })),
    given: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.shape({
            ...itemType,
            count: PropTypes.number.isRequired,
        })),
        PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ])),
    ]),
    current: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.shape({
            ...itemType,
            count: PropTypes.number.isRequired,
        })),
        PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ])),
    ]),
    limit: PropTypes.number,
    added: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.shape({
            ...itemType,
            count: PropTypes.number.isRequired,
        })),
        PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ])),
    ]),
    removed: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.shape({
            ...itemType,
            count: PropTypes.number.isRequired,
        })),
        PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ])),
    ]),
    add: PropTypes.number,
    replace: PropTypes.number,
    filter: PropTypes.object,
    multiple: PropTypes.bool,
    hidden: PropTypes.bool,
    objectlist: PropTypes.bool,
};

ListPropertySelect.defaultProps = {
    added: [],
    removed: [],
    given: [],
    current: [],
    limit: 0,
    add: 0,
    replace: 0,
    multiple: false,
    filter: {},
    items: [],
    hidden: false,
    objectlist: false,
};

export default ListsToItemsWrapper(
    CharacterEditorWrapper(ListPropertySelect),
    'items'
);
