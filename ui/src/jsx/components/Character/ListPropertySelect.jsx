import React from 'react';
import PropTypes from 'prop-types';

import BaseTagContainer from '../BaseTagContainer.jsx';
import LazyComponent from '../LazyComponent.jsx';

class ListPropertySelect extends BaseTagContainer
{
    constructor(props) {
        super(props);
        this.state = {
            value: [],
        };
    }

    componentDidMount() {
        this.props.onChange(
            this.props.path,
            this.props.given || []
        );
    }

    componentWillUnmount() {
        this.props.onChange(
            this.props.path,
            undefined
        );
    }

    isDisabled(item) {
        const { multiple, current, given } = this.props;
        if (multiple) {
            return false;
        }
        const value = item.code || item.name;
        if (_.includes(current, value)) {
            return true;
        }
        if (_.includes(given, value)) {
            return true;
        }
        if (_.includes(this.state.value, value)) {
            return true;
        }
        return false;
    }

    _setState(value) {
        const { onChange, path, given = [] } = this.props;
        this.setState(
            {value},
            () => onChange(path, this.state.value.concat(given))
        );
    }

    onChange(key, value) {
        let head = _.take(
            this.state.value,
            key
        );
        let tail = _.takeRight(
            this.state.value,
            this.state.value.length - key - 1
        );
        this._setState(
            head.concat([value]).concat(tail)
        );
    }

    onDelete(key, value) {
        let head = _.take(
            this.state.value,
            key
        );
        let tail = _.takeRight(
            this.state.value,
            this.state.value.length - key - 1
        );
        this._setState(
            head.concat(tail)
        );
    }

    onAdd(value) {
        let head = _.take(
            this.state.value,
            this.state.value.length
        );
        this._setState(
            head.concat([value])
        );
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
        const { given = [], current = [] } = this.props;

        let tags = _.map(
            this.state.value,
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

        return tags.concat( _.filter( _.map(
            current,
            (code) => {
                if (upgrade[code] || 0) {
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
                        immutable: true
                    }
                );
            }
        ) ) );
    }

    showSelect() {
        if ((this.props.limit || 0) - this.state.value.length) {
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
