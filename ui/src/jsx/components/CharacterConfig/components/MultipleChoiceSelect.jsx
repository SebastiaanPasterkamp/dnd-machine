import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TagContainer from '../../TagContainer';

import CharacterConfig from '../CharacterConfig';
import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper';
import MatchesFilters from '../utils/MatchesFilters';

export class MultipleChoiceSelect extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            showSelect: false,
            disabled: true,
        };
        this.onAdd = this.onAdd.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const { added, removed, add, limit, replace } = props;
        const current = MultipleChoiceSelect.getCurrent(props);

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

    onAdd(uuid) {
        const {
            added, removed, filtered, limit, add, replace, setState,
        } = this.props;
        const current = MultipleChoiceSelect.getCurrent(this.props);

        if (limit) {
            if (current.length >= limit) {
                return false;
            }
        } else if (added.length >= (add + removed.length)) {
            return false;
        }

        const state = { added, removed, filtered };
        if (_.includes(removed, uuid)) {
            state.removed = _.without(removed, uuid);
        } else if (added.length < (add + removed.length)) {
            state.filtered = _.without(filtered, uuid);
            state.added = _.concat(added, [uuid]);
        }
        setState(state);
    }

    onDelete(uuid) {
        const {
            added, removed, filtered, limit, add, replace, setState,
        } = this.props;
        const state = { added, removed, filtered };

        if (_.includes(added, uuid)) {
            state.added = _.without(added, uuid);
            state.filtered = _.concat(removed, [uuid]);
        } else if (removed.length < replace) {
            state.removed = _.concat(removed, [uuid]);
        }
        setState(state);
    }

    onSetState() {}

    static getCurrent(props, state) {
        const { added, removed, filtered, options, getCurrent } = props;

        const current = _.chain(options)
            .filter(option => {
                if (_.includes(added, option.uuid)) {
                    return true;
                }
                if (_.includes(filtered, option.uuid)) {
                    return false;
                }
                if (_.includes(removed, option.uuid)) {
                    return false;
                }
                const path = (
                    _.get(option, 'path')
                    || _.get(option, ['config', 0, 'path'])
                );
                return getCurrent(path);
            })
            .map(option => option.uuid)
            .value();
        return current;
    }

    render() {
        const {
            added, removed, filtered, options, limit, add, replace,
            filter: filters,
        } = this.props;
        const { showSelect, disabled } = this.state;

        const current = MultipleChoiceSelect.getCurrent(this.props);
        const itemsDisabled = disabled || removed.length >= replace;
        const items = _.chain(options)
            .filter(option => !option.hidden && MatchesFilters(option, filters))
            .map(option => {
                const isNew = _.includes(added, option.uuid);
                return {
                    id: option.uuid,
                    label: option.label,
                    color: isNew ? 'info' : 'warning',
                    disabled: !isNew && itemsDisabled,
                };
            })
            .value();

        return (
            <div>
                <TagContainer
                    value={current}
                    items={items}
                    onAdd={this.onAdd}
                    onDelete={this.onDelete}
                    setState={this.onSetState}
                    showSelect={showSelect}
                />
                {_.map(
                    options,
                    (config, i) => _.includes(current, config.uuid) ? (
                        <CharacterConfig
                            key={i}
                            config={ [config] }
                        />
                    ) : null
                )}
            </div>
        );
    }
};

MultipleChoiceSelect.propTypes = {
    type: PropTypes.oneOf(['multichoice']).isRequired,
    uuid: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    getCurrent: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.object),
    description: PropTypes.string,
    include: PropTypes.number,
    added: PropTypes.array,
    removed: PropTypes.array,
    filtered: PropTypes.array,
    limit: PropTypes.number,
    add: PropTypes.number,
    replace: PropTypes.number,
};

MultipleChoiceSelect.defaultProps = {
    added: [],
    removed: [],
    filtered: [],
    options: [],
    description: '',
    limit: 0,
    add: 0,
    replace: 0,
};

export default CharacterEditorWrapper(
    MultipleChoiceSelect,
    {
        character: true,
    }
);
