import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import actions from '../actions/CharacterEditorActions.jsx';
import store from '../stores/CharacterEditorStore.jsx';

function CharacterEditorWrapper(WrappedComponent) {

    const CharacterEditorComponent = class extends Reflux.Component {

        constructor(props) {
            super(props);
            this.store = store;
            this.storeKeys = ['character'];
            this._id = _.uniqueId();
        }

        componentWillMount() {
            super.componentWillMount.call(this);

            const id = _.get(this.props, 'match.params.id');
            if (id == null) {
                return;
            }
            const path = _.get(this.props, 'match.path');
            if (path.match('reset')) {
                actions.resetCharacter(id);
            } else {
                actions.editCharacter(id);
            }
        }

        onSave = (callback=null) => {
            const id = _.get(this.props, 'match.params.id');

            actions.postCharacter(
                this.state.character, id, callback,
            );
        }

        onUpdate = (callback=null) => {
            const id = _.get(this.props, 'match.params.id');

            actions.patchCharacter(
                this.state.character, id, callback,
            );
        }

        onChange = (change) => {
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

        getCurrent = (path) => {
            if (!path) {
                return this.state.character;
            }
            return _.get(this.state.character, path);
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
                ...rest
            } = this.props;

            let props = {
                onSave: this.onSave,
                onUpdate: this.onUpdate,
                onChange: this.onChange,
                getCurrent: this.getCurrent,
            };
            if (path) {
                props.current = this.getCurrent(path);
            }

            return <WrappedComponent
                {...rest}
                {...props}
                />
        }
    };

    CharacterEditorComponent.WrappedComponent = WrappedComponent;

    return CharacterEditorComponent;
};

export default CharacterEditorWrapper;
