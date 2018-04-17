import React from 'react';
import PropTypes from 'prop-types';

import BaseTagContainer from '../BaseTagContainer.jsx';
import LazyComponent from '../LazyComponent.jsx';

class ListPropertySelect extends BaseTagContainer
{
    constructor(props) {
        super(props);
        this.state = {
            added: [],
            removed: [],
        };
    }

    componentDidMount() {
        this.onSetState();
    }

    componentWillUnmount() {
        const { onChange, path } = this.props;
        onChange(path, undefined);
    }

    isDisabled(item) {
        const { multiple, current, given } = this.props;
        const { added, removed } = this.state;
        if (multiple) {
            return false;
        }
        const value = item.code || item.name;
        if (_.includes(removed, value)) {
            return false;
        }
        if (_.includes(current, value)) {
            return true;
        }
        if (_.includes(given, value)) {
            return true;
        }
        if (_.includes(added, value)) {
            return true;
        }
        return false;
    }

    onSetState() {
        const { onChange, path, given = [] } = this.props;
        const { added, removed } = this.state;
        onChange(path, {
            added: added.concat(given),
            removed
        });
    }

    onDelete(key, item) {
        const value = item.code || item.name;
        const { replace = 0 } = this.props;
        const { added, removed } = this.state;
        let state = { added, removed };
        if (_.includes(added, value)) {
            state.added = _.without(state.added, value);
        } else if (removed.length < replace) {
            state.removed = state.removed.concat([value]);
        }
        this.setState(state, () => this.onSetState());
    }

    onAdd(value) {
        const { limit = 0, replace = 0 } = this.props;
        const { added, removed } = this.state;
        let state = { added, removed };
        if (_.includes(removed, value)) {
            state.removed = _.without(state.removed, value);
        } else if (added.length < (limit + removed.length)) {
            state.added = state.added.concat([value]);
        }
        this.setState(state, () => this.onSetState());
    }

    getItem(key, value) {
        return value;
    }

    findItem(value, _default={label: value, color: 'bad'}) {
        return _.find(this.props.items, {code: value})
            || _.find(this.props.items, {name: value})
            || _default;
    }

    getTags() {
        const {
            given = [], current = [], replace = 0
        } = this.props;
        const { added, removed } = this.state;

        let tags = _.map(
            added,
            (code) => this.findItem(code)
        ).concat( _.map(
            given,
            (code) => _.assign(
                {},
                this.findItem(code),
                {
                    color: 'info',
                    immutable: true,
                }
            )
        ) );

        let upgrade = _.countBy(
            tags,
            (item) => (item.code || item.name)
        );
        let downgrade = _.countBy(
            removed,
            (item) => (item.code || item.name)
        );
        _.forEach(downgrade, (count, code) => {
            upgrade[code] = (upgrade[code] || 0) - count;
        });

        const immutable = (replace - removed.length) <= 0;
        return tags.concat( _.filter( _.map(
            _.without(current, removed),
            (code) => {
                if ((upgrade[code] || 0) > 0) {
                    upgrade[code] -= 1;
                    return null;
                }
                const _current = this.findItem(code, null);
                if (!_current) {
                    return null;
                }
                return _.assign(
                    {},
                    _current,
                    {immutable}
                );
            }
        ) ) );
    }

    showSelect() {
        const { limit = 0, replace = 0 } = this.props;
        const { added, removed } = this.state;
        if ((limit - added.length + removed.length) > 0) {
            return true;
        }
        return false;
    }

    getSelectOptions() {
        const { limit, filter = [], items } = this.props;

        if (!limit) {
            return [];
        }

        const _filter = _.reduce(
            filter,
            (filter, cond, path) => {
                if (path.match('_formula')) {
                    return filter;
                }
                filter[path] = _.isArray(cond) ? cond : [cond];
                return filter;
            },
            {}
        );

        if (!_filter) {
            return items;
        }

        const filtered = _.filter(
            items,
            (item) => _.every(
                _filter,
                (cond, path) => {
                    const value = _.get(item, path);
                    return _.intersection(
                        _.isArray(value) ? value : [value],
                        cond
                    ).length;
                }
            )
        );

        return filtered;
    }

    render() {
        if (this.props.hidden) {
            return null;
        }

        return super.render.call(this);
    }

};

ListPropertySelect.propTypes = {
    path: PropTypes.string.isRequired,
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
    filter: PropTypes.object,
    multiple: PropTypes.bool,
    hidden: PropTypes.bool,
};

export default ListPropertySelect;
