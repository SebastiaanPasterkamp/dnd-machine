import React from 'react';
import PropTypes from 'prop-types';
import {
    concat,
    countBy,
    entries,
    every,
    find,
    filter,
    flow,
    forEach,
    get,
    includes,
    isArray,
    intersection,
    map,
    keys,
    some,
    uniq,
    without,
} from 'lodash/fp';

import {
    BaseTagContainer,
    Tag,
    TagBadge,
} from '../../BaseTagContainer';
import LazyComponent from '../../LazyComponent';
import SingleSelect from '../../SingleSelect';

import { memoize } from '../../../utils';

import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper';
import ListsToItemsWrapper from '../../../hocs/ListsToItemsWrapper';

export class ListPropertySelect extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            added: [],
            removed: [],
            showSelect: false,
            disabled: true,
        };
        this.memoize = memoize.bind(this);
        this.onSetState = this.onSetState.bind(this);
    }

    getId({ id, code, name}) {
        if (id !== undefined) {
            return id;
        }
        if (code !== undefined) {
            return code;
        }
        return name;
    }

    getLabel({ label, name}) {
        if (label !== undefined) {
            return label;
        }
        return name;
    }

    static getDerivedStateFromProps(props, state) {
        const { add, limit, replace, current } = props;
        const { added, removed } = state;

        const showSelect = Boolean(
            (state.added.length - state.removed.length) < add
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

    componentDidMount() {
        const { given } = this.props;
        if (given.length) {
            this.onSetState();
        }
    }

    onSetState() {
        const { onChange, given } = this.props;
        const { added, removed } = this.state;
        onChange({
            added: concat(added, given),
            removed,
        });
    }

    onDelete = (id) => this.memoize(
        `delete-${id}`,
        () => {
            const { replace, multiple } = this.props;
            const { added, removed } = this.state;
            const state = { added, removed };
            if (includes(id, added)) {
                state.added = without([ id ], added);
            } else if (removed.length < replace) {
                state.removed = concat(removed, [id]);
                if (!multiple) {
                    state.removed = uniq(state.removed);
                }
            }
            this.setState(state, this.onSetState);
        }
    );

    onAdd = (id) => {
        const { add, limit, current, multiple } = this.props;
        const { added, removed } = this.state;

        if (limit) {
            if (current.length >= limit) {
                return false;
            }
        } else if (added.length >= (add + removed.length)) {
            return false;
        }

        const state = { added, removed };
        if (includes(id, removed)) {
            state.removed = without([ id ], removed);
        } else {
            state.added = concat(added, [id]);
            if (!multiple) {
                state.added = uniq(state.added);
            }
        }
        this.setState(state, this.onSetState);
    }

    findItem(id, _default=undefined) {
        _default = _default || { label: `${id}`, color: 'bad' };
        const { items } = this.props;
        const match = find({id: id}, items)
                    || find({code: id}, items)
                    || find({name: id}, items);

        if (!match && _default !== undefined) {
            return _default;
        }

        const item = match || {
            ..._default,
            id,
        };

        return ({
            id: this.getId(item),
            label: this.getLabel(item),
            description: item.description,
        });
    }

    getValue() {
        const { given, current, replace } = this.props;
        const { added, removed, disabled } = this.state;

        const tags = concat(
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
        );

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
                    const _current = this.findItem(id, null);
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

    matchesFilters(item, filters) {
        return flow(entries, every(
            ([path, cond]) => {
                if (path.match(/_(formula|default)$/)) {
                    return true;
                }
                if (path === 'or') {
                    return some(
                        option => this.matchesFilters(item, option)
                    )(cond);
                }
                if (path === 'and') {
                    return this.matchesFilters(item, cond);
                }
                if (path === 'not') {
                    return !this.matchesFilters(item, cond);
                }
                const value = get(path, item);
                return intersection(
                    isArray(value) ? value : [value],
                    isArray(cond) ? cond : [cond],
                ).length;
            }
        ))(filters);
    }

    renderSelect() {
        const {
            multiple,
            filter: filters,
            items,
            current,
            given,
            limit,
            add,
            replace,
        } = this.props;
        const { added, removed, showSelect } = this.state;

        if (!items.length) return null;

        if (!showSelect) {
            return null;
        }

        const values = [...given, ...current, ...added];
        const filtered = filter(
            item => (
                multiple
                || includes( this.getId(item), removed )
                || !includes( this.getId(item), values )
            ),
            filter(
                item => (
                    includes( this.getId(item), removed )
                    || this.matchesFilters(item, filters)
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
    onChange: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object),
    given: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    ),
    current: PropTypes.array,
    limit: PropTypes.number,
    add: PropTypes.number,
    replace: PropTypes.number,
    filter: PropTypes.object,
    multiple: PropTypes.bool,
    hidden: PropTypes.bool,
};

ListPropertySelect.defaultProps = {
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
    CharacterEditorWrapper(
        ListPropertySelect,
        {
            current: true,
        }
    ),
    'items'
);
