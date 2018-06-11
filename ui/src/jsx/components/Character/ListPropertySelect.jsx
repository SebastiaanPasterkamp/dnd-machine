import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
    TagsContainer,
    Tag,
    TagBadge,
} from '../BaseTagContainer.jsx';
import LazyComponent from '../LazyComponent.jsx';
import SingleSelect from '../SingleSelect.jsx';

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

    onDelete(value) {
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
        const match = _.find(items, {code: value})
            || _.find(items, {name: value});

        if (!match && !_default) {
            return _default;
        }

        const item = match || _.assign(
            {},
            _default,
            {code: value, label: value}
        );

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
            code => _.assign(
                {},
                this.findItem(code),
                {
                    color: 'info',
                }
            )
        ).concat( _.map(
            given,
            code => _.assign(
                {},
                this.findItem(code),
                {
                    color: 'good',
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
                    {
                        color: disabled ? null : 'warning',
                        disabled
                    }
                );
            }
        ) ) );
    }

    renderSelect() {
        const {
            multiple, filter = [], items, current = [], given = [],
            limit = 0, replace = 0,
        } = this.props;
        const { added, removed } = this.state;

        if (!items.length) return null;

        if ((limit - added.length + removed.length) <= 0) {
            return null;
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

        const values = _.concat(
            given, current, added
        );
        const filtered = _.chain(items)
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
                || _.includes(removed, _.get(item, 'code', item.name))
                || !_.includes(values, _.get(item, 'code', item.name))
            ))
            .value();

        if (!filtered.length) return null;

        return <SingleSelect
            emptyLabel="Add..."
            items={filtered}
            setState={item => this.onAdd(item)}
            />;
    }

    render() {
        const { hidden, } = this.props;

        if (hidden) {
            return null;
        }

        const tags = _.map(
            this.getValue(),
            tag => _.assign(tag, {
                onDelete: () => this.onDelete(tag.id),
            })
        );

        return <TagsContainer>
            {this.renderSelect()}

            {_.map(tags, (tag, i) => (
                <Tag
                    key={`tag-${i}`}
                    {...tag}
                    />
            ))}

        </TagsContainer>;
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
    replace: PropTypes.number,
    limit: PropTypes.number,
    filter: PropTypes.object,
    multiple: PropTypes.bool,
    hidden: PropTypes.bool,
};

export default ListPropertySelect;
