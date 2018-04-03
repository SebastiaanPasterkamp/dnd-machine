import React from 'react';
import PropTypes from 'prop-types';

import LazyComponent from '../LazyComponent.jsx';
import TagContainer from '../TagContainer.jsx';

import CharacterConfig from './CharacterConfig.jsx';

class MultipleChoiceSelect extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            used: [],
            removed: []
        };
    }

    componentWillUnmount() {
        _.forEach(
            this.state.replace,
            path => this.props.onChange(path, undefined)
        );
    }

    onAdd(value) {
        const limit = this.props.limit
                    + this.state.removed.length;
        if (_.includes(this.state.removed, value)) {
            let removed = _.without(this.state.used, value);
            this.setState({removed}, () => {
                this.props.onChange(value, undefined)
            });
        } else if (this.state.used.length < limit) {
            let used = _.union(this.state.used, [value]);
            this.setState({used});
        }
    }

    onDelete(key, value) {
        const limit = this.props.replace;
        if (_.includes(this.state.used, value)) {
            let used = _.without(this.state.used, value);
            this.setState({used});
        } else if (this.state.removed.length < limit) {
            let removed = _.union(this.state.removed, [value]);
            this.setState({removed}, () => {
                this.props.onChange(value, null)
            });
        }
    }

    renderTags() {
        const {getCurrent, limit, replace} = this.props;
        const {used, removed} = this.state;
        const showSelect = used.length < limit;
        const currentImmutable = removed.length >= replace;
        const current = _.reduce(
            this.props.options,
            (current, option) => {
                if (getCurrent(option.path)) {
                    current.push(option.path);
                }
                return current;
            },
            []
        );
        const tagOptions = _.map(this.props.options, option => {
            const isNew = _.includes(used, option.path);
            return {
                code: option.path,
                label: option.label,
                immutable: currentImmutable && !isNew,
                color: isNew ? 'info' : 'warning'
            };
        });

        return <TagContainer
            tags={current}
            tagOptions={tagOptions}
            onAdd={(value) => this.onAdd(value)}
            onDelete={(key, value) => this.onDelete(key, value)}
            onChange={() => { return null; }}
            showSelect={showSelect}
            />;
    }

    render() {
        const {used, removed} = this.state;
        const changes = _.union(used, removed);

        return <div>
            {this.renderTags()}
            {_.map(this.props.options, (option, index) => {
                if (!_.includes(changes, option.path)) {
                    return null;
                }
                const props = {
                    index: this.props.index.concat([index]),
                    getCurrent: this.props.getCurrent,
                    getItems: this.props.getItems,
                    onChange: this.props.onChange,
                    config: [option],
                    disabled: _.includes(removed, option.path)
                };

                return <CharacterConfig
                    key={index}
                    {...props}
                    />;
            })}
        </div>;
    }
};

MultipleChoiceSelect.defaultTypes = {
    replace: 0
};

MultipleChoiceSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    getCurrent: PropTypes.func.isRequired,
    getItems: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    description: PropTypes.string,
    limit: PropTypes.number.isRequired,
    replace: PropTypes.number,
};

export default MultipleChoiceSelect;
