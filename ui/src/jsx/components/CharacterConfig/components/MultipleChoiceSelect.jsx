import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import LazyComponent from '../../LazyComponent.jsx';
import TagContainer from '../../TagContainer.jsx';

import CharacterConfig from '../CharacterConfig.jsx';
import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper.jsx';

export class MultipleChoiceSelect extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            added: [],
            removed: [],
            filtered: [],
            showSelect: props.limit > 0 || props.add > 0,
            disabled: props.replace <= 0,
        };
    }

    onAdd = (label) => {
        const { limit, add, replace } = this.props;
        const { added, removed, filtered } = this.state;
        const state = { added, removed, filtered };

        if (_.includes(removed, label)) {
            state.removed = _.without(removed, label);
        } else if (added.length < (add + removed.length)) {
            state.filtered = _.without(filtered, label);
            state.added = _.concat(added, [label]);
        }
        state.showSelect = (state.added.length - state.removed.length) < add;
        state.disabled = state.removed.length >= replace;
        this.setState(state);
    }

    onDelete = (label) => {
        const { limit, add, replace } = this.props;
        const { added, removed, filtered } = this.state;
        let state = { added, removed, filtered };

        if (_.includes(added, label)) {
            state.added = _.without(added, label);
            state.filtered = _.concat(removed, [label]);
        } else if (removed.length < replace) {
            state.removed = _.concat(removed, [label]);
        }
        state.showSelect = (state.added.length - state.removed.length) < add;
        state.disabled = state.removed.length >= replace;

        this.setState(state);
    }

    onSetState = () => null;

    render() {
        const {
            options, limit, add, replace, getCurrent,
        } = this.props;
        const {
            added, removed, filtered, showSelect, disabled,
        } = this.state;

        const value = _.chain(options)
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
        const items = _.chain(options)
            .filter(option => !option.hidden)
            .map(option => {
                const isNew = _.includes(added, option.label);
                return {
                    code: option.label,
                    label: option.label,
                    color: isNew ? 'info' : 'warning'
                };
            })
            .value();

        return (
            <div>
                <TagContainer
                    value={value}
                    items={items}
                    onAdd={ this.onAdd }
                    onDelete={ this.onDelete }
                    setState={ this.onSetState }
                    showSelect={ showSelect }
                />
                {_.map(
                    options,
                    (config, i) => _.includes(value, config.label) ? (
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
