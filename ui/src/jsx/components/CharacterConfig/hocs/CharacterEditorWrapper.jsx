import React from 'react';
import Reflux from 'reflux';
import {
    concat,
    forEach,
    get,
    isEqual,
    keys,
    reduce,
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
            this.state = {};

            this.onSave = this.onSave.bind(this);
            this.onUpdate = this.onUpdate.bind(this);
            this.onSetState = this.onSetState.bind(this);

            this.mapStoreToState(
                store,
                (updated) => reduce(
                    (mapped, key) => {
                        if (storeKeys[key]) {
                            mapped[key] = updated[key];
                        };
                        if (key === 'character') {
                            const { path, type } = this.props;
                            mapped.current = get(path, updated[key]);
                        }
                        if (key === 'choices') {
                            const { uuid } = this.props;
                            const { [uuid]: state } = updated[key];
                            mapped.state = state;
                        }
                        return mapped;
                    },
                    {}
                )(keys(updated))
            );
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

        componentWillUnmount() {
            super.componentWillUnmount.call(this);
        }

        componentWillMount() {
            super.componentWillMount.call(this);

            forEach(
                (config) => {
                    if (storeKeys[config] !== 'fetch') {
                        return;
                    }
                    actions.getCharacterConfig(config)
                }
            )(keys(storeKeys));

            const id = get('match.params.id', this.props);
            const path = get('match.path', this.props);

            if (path === null || id === undefined) {
                return;
            }

            if (path.match('reset')) {
                actions.resetCharacter(id);
            } else {
                actions.editCharacter(id);
            }
        }

        onSave(callback=null) {
            const id = get('match.params.id', this.props);

            actions.postCharacter(this.state.character, id, callback);
        }

        onUpdate(callback=null) {
            const id = get('match.params.id', this.props);

            actions.patchCharacter(this.state.character, id, callback);
        }

        onSetState(state) {
            const { uuid, path } = this.props;
            actions.addChoice(uuid, path, state);
        }

        render() {
            const {
                path,
                uuid,
                type,
                ...restProps
            } = this.props;
            const { current, state } = this.state;

            const props = reduce(
                (props, key) => {
                    const { [key]: value } = this.state;
                    props[key] = value;
                    return props;
                },
                {
                    ...state,
                    type,
                    uuid,
                    current,
                    onSave: this.onSave,
                    onUpdate: this.onUpdate,
                    setState: this.onSetState,
                }
            )(keys(storeKeys));

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
