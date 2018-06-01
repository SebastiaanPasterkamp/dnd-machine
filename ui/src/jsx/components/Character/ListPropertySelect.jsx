import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BaseTagContainer from '../BaseTagContainer.jsx';
import LazyComponent from '../LazyComponent.jsx';

class ListPropertySelect extends LazyComponent
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

    onSetState() {
        const { onChange, path, given = [] } = this.props;
        const { added, removed } = this.state;
        onChange(path, {
            added: _.concat(added, given),
            removed
        });
    }

    onDelete(value, index) {
        const { replace = 0 } = this.props;
        const { added, removed } = this.state;
        let state = { added, removed };
        if (_.includes(added, value)) {
            state.added = _.without(state.added, value);
        } else if (removed.length < replace) {
            state.removed = _.concat(state.removed, [value]);
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
            state.added = _.concat(state.added, [value]);
        }
        this.setState(state, () => this.onSetState());
    }

    findItem(value, _default={label: value, color: 'bad'}) {
        const { items = [] } = this.props;
        const item = _.find(items, {code: value})
            || _.find(items, {name: value})
            || _.assign({}, _default, {code: value, label: value});

        return {
            id: _.get(item, 'code', item.name),
            label: _.get(item, 'label', item.name),
            description: item.description,
        };
    }

    getValue() {
        const {
            given = [], current = [], replace = 0,
        } = this.props;
        const { added, removed } = this.state;

        const tags = _.map(
            added,
            code => this.findItem(code)
        ).concat( _.map(
            given,
            code => _.assign(
                {},
                this.findItem(code),
                {
                    className: 'info',
                    disabled: true,
                }
            )
        ) );

        let upgrade = _.countBy(tags, 'id');
        let downgrade = _.countBy(removed, 'id');
        _.forEach(downgrade, (count, code) => {
            upgrade[code] = _.get(upgrade, code, 0) - count;
        });

        const disabled = (replace - removed.length) <= 0;
        return tags.concat( _.filter( _.map(
            _.without(current, removed),
            code => {
                if (_.get(upgrade, code, 0) > 0) {
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
                    {disabled}
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

    getItems(value, multiple) {
        const { filter = [], items, current, given, } = this.props;
        const { added, removed } = this.state;

        if (!this.showSelect()) {
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

        const values = _.map(value, 'id');
        const filtered = _(items)
            .filter(item => _.every(
                _filter,
                (cond, path) => {
                    const value = _.get(item, path);
                    return _.intersection(
                        _.isArray(value) ? value : [value],
                        cond
                    ).length;
                }
            ))
            .filter(item => (
                multiple
                || !_.includes(values, _.get(item, 'code', item.name))
            ))
            .value();

        return filtered;
    }

    render() {
        const {
            path, onChange, given, current, limit, filter, multiple,
            hidden, ...props,
        } = this.props;

        if (hidden) {
            return null;
        }

        const value = this.getValue();

        return <BaseTagContainer
            {...props}
            items={this.getItems(value, multiple)}
            onAdd={(value) => this.onAdd(value)}
            onDelete={(item, index) => this.onDelete(item, index)}
            showSelect={this.showSelect()}
            value={value}
            />;
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
