import React from 'react';
import Reflux from 'reflux';
import {
    concat,
    forEach,
    get,
    isEqual,
    keys,
} from 'lodash/fp';

import actions from '../actions/CharacterEditorActions';
import store from '../stores/CharacterEditorStore';

function CharacterEditorWrapper(
    WrappedComponent,
    storeKeys={},
) {
    const CharacterEditorComponent = class extends Reflux.Component {

        constructor(props) {
            super(props);
            this.store = store;
            this.storeKeys = concat(
                keys(storeKeys),
                ['character']
            );
            this.onSave = this.onSave.bind(this);
            this.onUpdate = this.onUpdate.bind(this);
            this.onChange = this.onChange.bind(this);
            this.onSetState = this.onSetState.bind(this);
            this.getCurrent = this.getCurrent.bind(this);
        }

        componentWillMount() {
            super.componentWillMount.call(this);

            const id = get('match.params.id', this.props);
            const path = get('match.path', this.props);

            if (path == null) {
                return;
            }
            if (path.match('reset')) {
                actions.resetCharacter(id);
            } else {
                actions.editCharacter(id);
            }
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (!isEqual(this.props, nextProps)) {
                return true;
            }

            if (!isEqual(this.state, nextState)) {
                return true;
            }

            return false;
        }

        onSave(callback=null) {
            const id = get('match.params.id', this.props);

            actions.postCharacter(
                this.state.character, id, callback,
            );
        }

        onUpdate(callback=null) {
            const id = get('match.params.id', this.props);

            actions.patchCharacter(
                this.state.character, id, callback,
            );
        }

        onChange(change) {
            const {
                uuid,
                path,
                ...rest
            } = this.props;
            actions.addChange( uuid, path, change, rest );
        }

        onSetState(state) {
            const { uuid } = this.props;
            actions.addChoice(uuid, state);
        }

        getCurrent(path) {
            const { character } = this.state;
            if (!path) {
                return character;
            }
            return get(path, character);
        }

        componentWillUnmount() {
            super.componentWillUnmount.call(this);
            const { uuid } = this.props;

            actions.removeChange( uuid );
            actions.removeChoice( uuid );
        }

        render() {
            const {
                path,
                ...restProps
            } = this.props;

            const props = {
                onSave: this.onSave,
                onUpdate: this.onUpdate,
                onChange: this.onChange,
                setState: this.onSetState,
                getCurrent: this.getCurrent,
            };

            forEach((key) => {
                if (!storeKeys[key]) {
                    console.log(`skipping ${key}`);
                    return;
                }
                const value = key === 'current'
                    ? this.getCurrent(path)
                    : this.state[key];
                props[key] = value;
            })(keys(storeKeys));

            return (
                <WrappedComponent
                    {...restProps}
                    {...props}
                />
            );
        }
    };

    CharacterEditorComponent.WrappedComponent = WrappedComponent;

    return CharacterEditorComponent;
};

export default CharacterEditorWrapper;
