import React from 'react';
import PropTypes from 'prop-types';
import {
    concat,
    countBy,
    entries,
    find,
    filter,
    flow,
    forEach,
    includes,
    map,
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

    getId({ id, code, name }) {
        if (id !== undefined) {
            return id;
        }
        if (code !== undefined) {
            return code;
        }
        return name;
    }

    getLabel({ label, name }) {
        if (label !== undefined) {
            return label;
        }
        return name;
    }

    static getDerivedStateFromProps(props, state) {
        const { added, removed, given, current, add, limit, replace } = props;

        const showSelect = Boolean(
            (added.length - removed.length) < add
            || current.length < limit
        );
        const disabled = removed.length >= replace;

        if (showSelect !== state.showSelect
            || disabled !== state.disabled
        ) {
            return { showSelect, disabled };
        }
        return null;
    }

    onDelete(id) {
        return this.memoize(
            `delete-${id}`,
            () => {
                const {
                    added, removed,
                    replace, multiple, setState,
                } = this.props;

                const state = { added, removed };
                if (includes(id, added)) {
                    state.added = without(added, id);
                } else if (removed.length < replace) {
                    state.removed = [...removed, id];
                    if (!multiple) {
                        state.removed = uniq(state.removed);
                    }
                }

                setState(state);
            }
        );
    }

    onAdd(id) {
        const {
            added, removed, current,
            add, limit, multiple, setState,
        } = this.props;

        if (limit) {
            if (current.length >= limit) {
                return false;
            }
        } else if (added.length >= (add + removed.length)) {
            return false;
        }

        const state = { added, removed };
        if (includes(id, removed)) {
            state.removed = without(removed, id);
        } else {
            state.added = [...added, id];
            if (!multiple) {
                state.added = uniq(state.added);
            }
        }

        setState(state);
    }

    findItem(id) {
        const { items } = this.props;
        if (!items.length) {
            return {
                id,
                label: id,
            };
        }
        const item = find({ id: id }, items)
                    || find({ code: id }, items)
                    || find({ name: id } , items);

        if (!item) {
            return undefined;
        }

        return ({
            id: this.getId({id, ...item}),
            label: this.getLabel(item),
            description: item.description,
        });
    }

    getValue() {
        const { added, removed, current, given, replace } = this.props;
        const { disabled } = this.state;

        const tags = filter(null, concat(
            map(
                id => ({
                    ...this.findItem(id),
                    color: 'info',
                })
            )(added),
            map(
                id => ({
                    ...this.findItem(id),
                    color: 'good',
                    disabled: true,
                })
            )(given)
        ));

        let upgrade = countBy('id', tags);
        let downgrade = countBy('id', removed);
        forEach(
            (count, id) => {
                upgrade[id] = (upgrade[id] || 0) - count;
            }
        )(downgrade);

        return concat(
            tags,
            filter(null, map(
                id => {
                    if (includes(id, given)) {
                        return null;
                    }
                    if (includes(id, removed)) {
                        return null;
                    }
                    if ((upgrade[id] || 0) > 0) {
                        upgrade[id] -= 1;
                        return null;
                    }
                    const _current = this.findItem(id);
                    if (!_current) {
                        return null;
                    }
                    return ({
                        ..._current,
                        color: disabled ? null : 'warning',
                        disabled,
                    });
                }
            )(current))
        );
    }

    renderSelect() {
        const {
            multiple,
            filter: filters,
            items,
            current,
            added,
            removed,
            given,
            limit,
            add,
            replace,
        } = this.props;
        const { showSelect } = this.state;

        if (!items.length) return null;

        if (!showSelect) {
            return null;
        }

        const filtered = filter(
            item => (
                multiple
                || includes( this.getId(item), removed )
                || !includes( this.getId(item), current )
            ),
            filter(
                item => (
                    includes( this.getId(item), removed )
                    || MatchesFilters(item, filters)
                ),
                items
            )
        );

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

                {flow(entries, map(([i, tag]) => (
                    <Tag
                        key={`tag-${i}`}
                        onDelete={this.onDelete(tag.id)}
                        {...tag}
                    />
                )))(this.getValue())}
            </BaseTagContainer>
        );
    }

};

ListPropertySelect.propTypes = {
    type: PropTypes.oneOf(['list']).isRequired,
    uuid: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object),
    given: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    ),
    current: PropTypes.array,
    limit: PropTypes.number,
    added: PropTypes.array,
    removed: PropTypes.array,
    add: PropTypes.number,
    replace: PropTypes.number,
    filter: PropTypes.object,
    multiple: PropTypes.bool,
    hidden: PropTypes.bool,
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
};

export default ListsToItemsWrapper(
    CharacterEditorWrapper(ListPropertySelect),
    'items'
);
