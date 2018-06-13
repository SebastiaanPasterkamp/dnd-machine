import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import LazyComponent from '../LazyComponent.jsx';
import TagContainer from '../TagContainer.jsx';

import CharacterConfig from './CharacterConfig.jsx';

class MultipleChoiceSelect extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            added: [],
            removed: [],
            filtered: [],
        };
    }

    onSetState() {
        const { options, onChange } = this.props;
        const { added, removed } = this.state;
    }

    onAdd(label) {
        const { limit = 0, replace = 0 } = this.props;
        const { added, removed, filtered } = this.state;
        let state = {};

        if (_.includes(filtered, label)) {
            state.filtered = _.without(filtered, label);
        }
        if (_.includes(removed, label)) {
            state.removed = _.without(removed, label);
        }
        if (added.length < (limit + removed.length)) {
            state.added = _.concat(added, [label]);
        }
        if (_.isEmpty(state)) {
            return;
        }
        this.setState(state, () => this.onSetState());
    }

    onDelete(label) {
        const { replace = 0 } = this.props;
        const { added, removed, filtered } = this.state;
        let state = {};

        if (!_.includes(filtered, label)) {
            state.filtered = _.concat(filtered, [label]);
        }
        if (_.includes(added, label)) {
            state.added = _.without(added, label);
        }
        if (removed.length < replace) {
            state.removed = _.concat(removed, [label]);
        }
        if (_.isEmpty(state)) {
            return;
        }
        this.setState(state, () => this.onSetState());
    }

    render() {
        const {
            options, index, getCurrent, getItems, onChange,
            limit = 0, replace = 0,
        } = this.props;
        const { added, removed, filtered } = this.state;
        const showSelect = (added.length - removed.length) < limit;
        const disabled = removed.length >= replace;

        const value = _.chain(options)
            .filter(option => {
                if (_.includes(added, option.label)) {
                    return true;
                }
                if (_.includes(filtered, option.label)) {
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

        const configs = _.filter(
            options,
            option => _.includes(value, option.label)
        );
        const props = {
            getCurrent,
            getItems,
            onChange,
        };

        return <div>
            <TagContainer
                value={value}
                items={items}
                onAdd={(label) => this.onAdd(label)}
                onDelete={(label, index) => this.onDelete(label)}
                setState={() => null}
                showSelect={showSelect}
                />

            {_.map(configs, (config, i) => (
                <CharacterConfig
                    key={i}
                    {...props}
                    index={ index.concat([i]) }
                    config={ [config] }
                    />
            ))}
        </div>;
    }
};

MultipleChoiceSelect.defaultTypes = {
    replace: 0
};

MultipleChoiceSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    index: PropTypes.arrayOf(PropTypes.number).isRequired,
    getCurrent: PropTypes.func.isRequired,
    getItems: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    description: PropTypes.string,
    limit: PropTypes.number,
    replace: PropTypes.number,
};

export default MultipleChoiceSelect;
