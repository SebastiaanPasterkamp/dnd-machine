import React from 'react';
import PropTypes from 'prop-types';
import {
    includes,
    filter,
    get,
    map,
    without,
} from 'lodash/fp';

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
        if (includes(uuid, removed)) {
            state.removed = without(removed, uuid);
        } else if (added.length < (add + removed.length)) {
            state.filtered = without(filtered, uuid);
            state.added = [...added, uuid];
        }
        setState(state);
    }

    onDelete(uuid) {
        const {
            added, removed, filtered, limit, add, replace, setState,
        } = this.props;
        const state = { added, removed, filtered };

        if (includes(uuid, added)) {
            state.added = without(added, uuid);
            state.filtered = [...removed, uuid];
        } else if (removed.length < replace) {
            state.removed = [...removed, uuid];
        }
        setState(state);
    }

    onSetState() {}

    static getCurrent(props, state) {
        const { added, removed, filtered, options, getCurrent } = props;

        const current = map(
            option => option.uuid
        )(
            filter(
                option => {
                    if (includes(option.uuid, added)) {
                        return true;
                    }
                    if (includes(option.uuid, filtered)) {
                        return false;
                    }
                    if (includes(option.uuid, removed)) {
                        return false;
                    }
                    // TODO: Check if option.uuid is in character.choices
                    const path = (
                        get('path', option)
                        || get(['config', 0, 'path'], option)
                    );
                    return getCurrent(path);
                }
            )(options)
        );
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
        const items = map(
            option => {
                const isNew = includes(option.uuid, added);
                return {
                    id: option.uuid,
                    label: option.label,
                    color: isNew ? 'info' : 'warning',
                    disabled: !isNew && itemsDisabled,
                };
            }
        )(
            filter(
                option => !option.hidden && MatchesFilters(option, filters)
            )(options)
        );

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
                {map(
                    (config) => includes(config.uuid, current) ? (
                        <CharacterConfig
                            key={config.uuid}
                            config={[config]}
                        />
                    ) : null
                )(options)}
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
