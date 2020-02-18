import React from 'react';
import Reflux from 'reflux';
import {
    concat,
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
            this.onSave = this.onSave.bind(this);
            this.onUpdate = this.onUpdate.bind(this);
            this.onSetState = this.onSetState.bind(this);

            this.mapStoreToState(
                store,
                (updated) => reduce(
                    (mapped, key) => {
                        if (storeKeys[key]) {
                            mapped[key] = updated[key];
                            return mapped;
                        };
                        if (key === 'character') {
                            const { path } = this.props;
                            mapped.current = get(path, updated[key]);
                        }
                        if (key === 'character') {
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

        onSetState(state) {
            const { uuid, path } = this.props;
            actions.addChoice(uuid, path, state);
        }

        getState() {
            const { state } = this.state;
            return state;
        }

        getCurrent(path) {
            const { current } = this.state;
            return current;
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
                    type,
                    uuid,
                    current,
                    onSave: this.onSave,
                    onUpdate: this.onUpdate,
                    setState: this.onSetState,
                    ...state,
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
