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
    isNil,
    intersection,
    map,
    keys,
    some,
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

    onDelete = (value) => this.memoize(
        `delete-${value}`,
        () => {
            const { replace } = this.props;
            const { added, removed } = this.state;
            const state = { added, removed };
            if (includes(value, added)) {
                state.added = without([ value ], added);
            } else if (removed.length < replace) {
                state.removed = concat(removed, [value]);
            }
            this.setState(state, () => this.onSetState());
        }
    );

    onAdd = (value) => {
        const { add, limit, current } = this.props;
        const { added, removed } = this.state;

        if (limit) {
            if (current.length >= limit) {
                return false;
            }
        } else if (added.length >= (add + removed.length)) {
            return false;
        }

        const state = { added, removed };
        if (includes(value, removed)) {
            state.removed = without([ value ], removed);
        } else {
            state.added = concat(added, [value]);
        }
        this.setState(state, () => this.onSetState());
    }

    findItem(value, _default={label: value, color: 'bad'}) {
        const { items = [] } = this.props;
        const match = find({code: value}, items)
            || find({id: value}, items)
            || find({name: value}, items);

        if (!match && !_default) {
            return _default;
        }

        const item = match || {
            ..._default,
            code: value,
            label: value,
        };

        return {
            id: isNil(item.id) ? ( isNil(item.code) ? item.name : item.code ) : item.id,
            label: isNil(item.label) ? item.name : item.label,
            description: item.description,
        };
    }

    getValue() {
        const { given, current, replace } = this.props;
        const { added, removed } = this.state;

        const tags = concat(
            map(
                code => ({
                    ...this.findItem(code),
                    color: 'info',
                })
            )(added),
            map(
                code => ({
                    ...this.findItem(code),
                    color: 'good',
                    disabled: true,
                })
            )(given)
        );

        let upgrade = countBy('id', tags);
        let downgrade = countBy('id', removed);
        forEach(
            (count, code) => {
                upgrade[code] = (upgrade[code] || 0) - count;
            }
        )(downgrade);

        const disabled = (replace - removed.length) <= 0;
        return concat(
            tags,
            filter(null, map(
                code => {
                    if ((upgrade[code] || 0) > 0) {
                        upgrade[code] -= 1;
                        return null;
                    }
                    const _current = this.findItem(code, null);
                    if (!_current) {
                        return null;
                    }
                    return ({
                        ..._current,
                        color: disabled ? null : 'warning',
                        disabled,
                    });
                }
            )(without(removed, current)))
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
            multiple, filter: filters, items, current, given,
            limit, add, replace,
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
                || includes(
                    isNil(item.code) ? item.name : item.code,
                    removed
                )
                || !includes(
                    isNil(item.code) ? item.name : item.code,
                    values
                )
            ),
            filter(
                item => (
                    includes(
                        isNil(item.code) ? item.name : item.code,
                        removed
                    )
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

        const tags = map(
            tag => ({
                ...tag,
                onDelete: this.onDelete(tag.id),
            })
        )(this.getValue());

        return (
            <BaseTagContainer>
                {this.renderSelect()}

                {flow(entries, map(([i, tag]) => (
                    <Tag
                        key={`tag-${i}`}
                        {...tag}
                    />
                )))(tags)}
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
