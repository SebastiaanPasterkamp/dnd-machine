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
        this.state = this.constructor.getDerivedStateFromProps(props, {});
        this.onAdd = this.onAdd.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const { added, removed, add, limit, replace } = props;

        const showSelect = Boolean(
            (added.length - removed.length) < add
        );
        const disabled = removed.length >= replace;

        if (showSelect !== state.showSelect
            || disabled !== state.disabled
        ) {
            return { showSelect, disabled };
        }
        return null;
    }

    getCurrent() {
        const { options, added, removed, choices } = this.props;
        const uuids = map(
            ({ uuid }) => uuid
        )(options);
        const current = filter(
            (uuid) => (
                (uuid in choices || includes(uuid, added))
                && !includes(uuid, removed)
            )
        )(uuids);
        return current;
    }

    onAdd(uuid) {
        const {
            added, removed,
            limit, add, replace, setState,
        } = this.props;
        const current = this.getCurrent();

        if (limit) {
            if (current.length >= limit) {
                return false;
            }
        } else if (added.length >= (add + removed.length)) {
            return false;
        }

        const state = { added, removed };
        if (includes(uuid, removed)) {
            state.removed = without(removed, uuid);
        } else {
            state.added = [...added, uuid];
        }

        setState(state);
    }

    onDelete(uuid) {
        const { added, removed, replace, setState } = this.props;

        const state = { added, removed };
        if (includes(uuid, added)) {
            state.added = without(added, uuid);
        } else if (removed.length < replace) {
            state.removed = [...removed, uuid];
        }

        setState(state);
    }

    onSetState() {}

    render() {
        const {
            added, options,
            filter: filters,
        } = this.props;
        const { showSelect, disabled } = this.state;
        const current = this.getCurrent();

        const items = map(
            ({ uuid, name }) => {
                const isNew = includes(uuid, added);
                return {
                    id: uuid,
                    name: name,
                    color: isNew ? 'info' : 'warning',
                    disabled: !isNew && disabled,
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
                            uuid={config.uuid}
                            config={[ config ]}
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
    options: PropTypes.arrayOf(PropTypes.object),
    choices: PropTypes.object,
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
    choices: {},
    description: '',
    limit: 0,
    add: 0,
    replace: 0,
};

export default CharacterEditorWrapper(
    MultipleChoiceSelect,
    {
        choices: true,
    }
);
