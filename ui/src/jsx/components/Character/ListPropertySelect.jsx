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

import { memoize } from '../../utils';

import CharacterEditorWrapper from '../../hocs/CharacterEditorWrapper.jsx';
import ListsToItemsWrapper from '../../hocs/ListsToItemsWrapper.jsx';

export class ListPropertySelect extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            added: [],
            removed: [],
        };
        this.memoize = memoize.bind(this);
    }

    componentDidMount() {
        this.onSetState();
    }

    onSetState() {
        const {
            onChange,
            given = [],
        } = this.props;
        const {
            added,
            removed,
        } = this.state;
        onChange({
            added: _.concat(added, given),
            removed,
        });
    }

    onDelete = (value) => this.memoize(
        `delete-${value}`,
        () => {
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
    );

    onAdd = (value) => {
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
        const { given, current, replace } = this.props;
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

    matchesFilter(item, filter) {
        if ('or' in filter) {
            console.assert(
                _.keys(filter).length === 1,
                "Cannot have OR filters with sibbling conditions"
            );
            return _.some(
                filter.or,
                option => this.matchesFilter(item, option)
            );
        }
        return _.every(
            filter,
            (cond, path) => {
                if (path.match(/_(formula|default)$/)) {
                    return true;
                }
                if (path === 'and'
                    && !this.matchesFilter(item, cond)
                ) {
                    return false;
                }
                const value = _.get(item, path);
                return _.intersection(
                    _.isArray(value) ? value : [value],
                    _.isArray(cond) ? cond : [cond],
                ).length;
            }
        );
    }

    renderSelect() {
        const {
            multiple, filter, items, current, given,
            limit, replace,
        } = this.props;
        const { added, removed } = this.state;

        if (!items.length) return null;

        if ((limit - added.length + removed.length) <= 0) {
            return null;
        }

        const values = _.concat(
            given, current, added
        );
        const filtered = _.chain(items)
            .filter(item => (
                _.includes(removed, _.get(item, 'code', item.name))
                || this.matchesFilter(item, filter)
            ))
            .filter(item => (
                multiple
                || _.includes(removed, _.get(item, 'code', item.name))
                || !_.includes(values, _.get(item, 'code', item.name))
            ))
            .value();

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
        const {
            hidden,
        } = this.props;
        if (hidden) {
            return null;
        }

        const tags = _.map(
            this.getValue(),
            tag => _.assign(tag, {
                onDelete: this.onDelete(tag.id),
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
    replace: PropTypes.number,
    limit: PropTypes.number,
    filter: PropTypes.object,
    multiple: PropTypes.bool,
    hidden: PropTypes.bool,
};

ListPropertySelect.defaultProps = {
    given: [],
    current: [],
    limit: 0,
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
