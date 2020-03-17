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
        const { added, removed, given, current, add, limit, replace } = props;
        const cntAdded = added.length;
        const cntCurrent = current.length;
        const cntRemoved = removed.length;

        const showSelect = (cntAdded - cntRemoved) < add || cntCurrent < limit;
        const disabled = cntRemoved >= replace;

        if (showSelect !== state.showSelect || disabled !== state.disabled) {
            return { showSelect, disabled };
        }
        return null;
    }

    increase(item, set) {
        const { multiple } = this.props;
        const { type, id } = item;

        if (multiple) {
            return [...set, id];
        }
        return uniq([...set, id]);
    }

    decrease(item, set) {
        const { multiple } = this.props;
        const { type, id } = item;

        const idx = findIndex(id, set);
        if (multiple && idx >= 0) {
            return [
                ...set.slice(0, idx),
                ...set.slice(idx + 1),
            ];
        }

        return without([id], set);
    }

    onDelete(item) {
        const { type, id } = item;
        const key = `delete-${id}`;
        const needle = i => i === id;

        return this.memoize(key, () => {
            const { added, removed, replace, setState } = this.props;
            const cntRemoved = removed.length;

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
        const { items, added, removed, setState } = this.props;
        const item = find({ id }, items);
        const needle = i => i === id;

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
            (id) => {
                const needle = i => i === id;
                const isAdded = find(needle, added) !== undefined;
                const isGiven = find(needle, given) !== undefined;
                const isRemoved = find(needle, removed) !== undefined;

                const retval = (
                    find({ id }, items)
                    || { id: id, name: id, count: 1 }
                );

                return {
                    ...retval,
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
                const { type, id } = item;
                if (find({ type, id }, removed)) {
                    return true;
                }
                if (!MatchesFilters(item, filters)) {
                    return false;
                }
                if (multiple) {
                    return true;
                }
                const needle = i => i === item.id;
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
    type: PropTypes.string.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    count: PropTypes.number,
};

ListPropertySelect.propTypes = {
    type: PropTypes.oneOf(['list']).isRequired,
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
    filter: [],
    items: [],
    hidden: false,
    objectlist: false,
};

export default ListsToItemsWrapper(
    CharacterEditorWrapper(ListPropertySelect),
    'items'
);
