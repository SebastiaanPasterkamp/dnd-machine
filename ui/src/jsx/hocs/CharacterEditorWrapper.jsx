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

            this.onChange = this.onChange.bind(this);
            this.getCurrent = this.getCurrent.bind(this);
        }

        onChange(change) {
            const {
                path,
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
            if (!path) {
                return this.state.character;
            }
            return _.get(this.state.character, path);
        }

        componentWillUnmount() {
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
