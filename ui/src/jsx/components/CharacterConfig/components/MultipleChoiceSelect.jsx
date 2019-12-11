import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TagContainer from '../../TagContainer';

import CharacterConfig from '../CharacterConfig';
import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper';

export class MultipleChoiceSelect extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            added: [],
            removed: [],
            filtered: [],
            showSelect: false,
            disabled: true,
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { add, limit, replace } = props;
        const { added, removed } = state;
        const current = MultipleChoiceSelect.getCurrent(props, state);

        const showSelect = Boolean(
            (added.length - removed.length) < add
            || current.length < limit
        );
        const disabled = removed.length >= replace;

        if (showSelect !== state.showSelect
            || disabled != state.disabled
        ) {
            return { showSelect, disabled };
        }
        return null;
    }

    onAdd = (label) => {
        const { limit, add, replace } = this.props;
        const { added, removed, filtered } = this.state;

        const current = MultipleChoiceSelect.getCurrent(
            this.props,
            this.state
        );

        if (limit) {
            if (current.length >= limit) {
                return false;
            }
        } else if (added.length >= (add + removed.length)) {
            return false;
        }

        const state = { added, removed, filtered };
        if (_.includes(removed, label)) {
            state.removed = _.without(removed, label);
        } else if (added.length < (add + removed.length)) {
            state.filtered = _.without(filtered, label);
            state.added = _.concat(added, [label]);
        }
        this.setState(state);
    }

    onDelete = (label) => {
        const { limit, add, replace } = this.props;
        const { added, removed, filtered } = this.state;
        const state = { added, removed, filtered };

        if (_.includes(added, label)) {
            state.added = _.without(added, label);
            state.filtered = _.concat(removed, [label]);
        } else if (removed.length < replace) {
            state.removed = _.concat(removed, [label]);
        }
        this.setState(state);
    }

    onSetState = () => null;

    static getCurrent(props, state) {
        const { options, getCurrent } = props;
        const { added, removed, filtered } = state;

        const current = _.chain(options)
            .filter(option => {
                if (_.includes(added, option.label)) {
                    return true;
                }
                if (_.includes(filtered, option.label)) {
                    return false;
                }
                if (_.includes(removed, option.label)) {
                    return false;
                }
                const path = (
                    _.get(option, 'path')
                    || _.get(option, ['config', 0, 'path'])
                );
                return getCurrent(path);
            })
            .map(option => option.label)
            .value();
        return current;
    }

    render() {
        const { options, limit, add, replace } = this.props;
        const {
            added, removed, filtered, showSelect, disabled,
        } = this.state;

        const current = MultipleChoiceSelect.getCurrent(
            this.props,
            this.state
        );
        const itemsDisabled = disabled || removed.length >= replace;
        const items = _.chain(options)
            .filter(option => !option.hidden)
            .map(option => {
                const isNew = _.includes(added, option.label);
                return {
                    code: option.label,
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
                    onAdd={ this.onAdd }
                    onDelete={ this.onDelete }
                    setState={ this.onSetState }
                    showSelect={ showSelect }
                />
                {_.map(
                    options,
                    (config, i) => _.includes(current, config.label) ? (
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

MultipleChoiceSelect.defaultProps = {
    limit: 0,
    add: 0,
    replace: 0,
};

MultipleChoiceSelect.propTypes = {
    type: PropTypes.oneOf(['multichoice']).isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    getCurrent: PropTypes.func.isRequired,
    description: PropTypes.string,
    limit: PropTypes.number,
    add: PropTypes.number,
    replace: PropTypes.number,
};

export default CharacterEditorWrapper(
    MultipleChoiceSelect,
    {
        character: true,
    }
);
