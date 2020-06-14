import React from 'react';
import Reflux from 'reflux';
import {
    concat,
    forEach,
    get,
    isEqual,
    keys,
    uniqueId,
} from 'lodash/fp';

import actions from '../actions/CharacterEditorActions.jsx';
import store from '../stores/CharacterEditorStore.jsx';

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
            this._id = uniqueId();
            this.onSave = this.onSave.bind(this);
            this.onUpdate = this.onUpdate.bind(this);
            this.onChange = this.onChange.bind(this);
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
                path,
                match,
                ...rest
            } = this.props;
            actions.addChange(
                path,
                change,
                this._id,
                rest,
            );
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

            actions.removeChange(
                this._id
            );
        }

        render() {
            const {
                path,
                ...restProps
            } = this.props;

            let props = {
                onSave: this.onSave,
                onUpdate: this.onUpdate,
                onChange: this.onChange,
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
