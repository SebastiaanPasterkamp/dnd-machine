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
            removed: []
        };
    }

    onSetState() {
        const { onChange } = this.props;
        const { added, removed } = this.state;
        // Remove 'removed' items
    }

    onAdd(label) {
        const { limit = 0, replace = 0 } = this.props;
        const { added, removed } = this.state;
        let state = { added, removed };
        if (_.includes(removed, label)) {
            state.removed = _.without(state.removed, label);
        } else if (added.length < (limit + removed.length)) {
            state.added = _.concat(state.added, [label]);
        }
        this.setState(state, () => this.onSetState());
    }

    onDelete(label, index) {
        const { replace = 0 } = this.props;
        const { added, removed } = this.state;
        let state = { added, removed };
        if (_.includes(added, label)) {
            state.added = _.without(state.added, label);
        } else if (removed.length < replace) {
            state.removed = _.concat(state.removed, [label]);
        }
        this.setState(state, () => this.onSetState());
    }

    renderTags() {
        const {
            options, getCurrent, limit = 0, replace = 0
        } = this.props;
        const { added, removed } = this.state;
        const showSelect = (added.length - removed.length) < limit;
        const disabled = removed.length >= replace;

        const current = _.chain(options)
            .filter(option => {
                if (_.includes(added, option.label)) {
                    return true;
                }
                const path = (
                    _.get(option, 'path')
                    || _.get(option, ['config', 0, 'path'])
                );
                return getCurrent(path);
            })
            .map(option => option.label)
            .value();

        const tagOptions = _.chain(options)
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

        return <TagContainer
            value={current}
            items={tagOptions}
            onAdd={(value) => this.onAdd(value)}
            onDelete={(key, value) => this.onDelete(key, value)}
            setState={() => { return null; }}
            showSelect={showSelect}
            />;
    }

    render() {
        const {
            options, index, getCurrent, getItems, onChange,
        } = this.props;
        const filtered = _.filter(
            options,
            option => _.includes(this.state.added, option.label)
        );

        const props = {
            getCurrent: getCurrent,
            getItems: getItems,
            onChange: onChange,
        };

        return <div>
            {this.renderTags()}

            {_.map(filtered, (option, i) => (
                <CharacterConfig
                    key={i}
                    {...props}
                    index={ index.concat([i]) }
                    config={ [option] }
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
