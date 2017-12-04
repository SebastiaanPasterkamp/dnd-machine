import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';
import ObjectDataStore from '../stores/ObjectDataStore.jsx';


function RoutedObjectDataWrapper(
    WrappedComponent, loadableType, loadableGroup=null
) {
    let pathPrefix = '/' + _.filter([
            loadableGroup,
            loadableType
            ]).join('/');

    return class extends Reflux.Component {
        constructor(props) {
            super(props);
            this.store = ObjectDataStore;
            this.storeKeys = [loadableType];
        }

        componentWillMount() {
            super.componentWillMount.call(this);

            let objectId = _.get(this.props, 'match.params.id');
            if (_.isUndefined(objectId)) {
                return;
            }

            this.setState({
                id: objectId
            }, () => this.onReload());
        }

        getStateProps(state) {
            return _.get(
                state, [loadableType, this.state.id]
            ) || ObjectDataStore.getInitial(loadableType);
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (!_.isEqual(this.props, nextProps)) {
                return true;
            }

            let old_data = this.getStateProps(this.state),
                new_data = this.getStateProps(nextState);

            if (!_.isEqual(old_data, new_data)) {
                return true;
            }

            return false;
        }

        nextView(id=null) {
            this.props.history.push(id == null
                ? pathPrefix + '/list'
                : pathPrefix + '/show/' + id
            );
        }

        onSetState(update, callback=null) {
            let loadable = _.assign(
                {},
                _.get(this.state, [loadableType, this.state.id]),
                update
                );
            let loaded = _.assign(
                {},
                this.state[loadableType],
                {[this.state.id]: loadable}
                );

            this.setState({
                [loadableType]: loaded
            }, callback);
        }

        onReload() {
            ObjectDataActions.getObject(
                loadableType,
                this.state.id,
                loadableGroup
            );
        }

        onRecompute() {
            ObjectDataActions.recomputeObject(
                loadableType,
                this.state.id,
                _.get(this.state, [loadableType, this.state.id]),
                loadableGroup
            );
        }

        onSave() {
            if (this.state.id == null) {
                ObjectDataActions.postObject(
                    loadableType,
                    _.get(this.state, [loadableType, this.state.id]),
                    loadableGroup,
                    () => this.nextView()
                );
            } else {
                ObjectDataActions.patchObject(
                    loadableType,
                    this.state.id,
                    _.get(this.state, [loadableType, this.state.id]),
                    loadableGroup,
                    () => this.nextView()
                );
            }
        }

        onPostObjectFailed(type, id, error) {
            if (type != loadableType || id != this.state.id) {
                return;
            }
            alert(error);
        }

        onPatchObjectFailed(type, id, error) {
            if (type != loadableType || id != this.state.id) {
                return;
            }
            alert(error);
        }

        onRecomputeObjectFailed(type, id, error) {
            if (type != loadableType || id != this.state.id) {
                return;
            }
            alert(error);
        }

        render() {
            let data = this.getStateProps(this.state);

            return <WrappedComponent
                setState={(state, callback=null) => this.onSetState(state, callback)}
                cancel={() => this.nextView()}
                reload={this.state.id != null
                    ? () => this.onReload()
                    : null
                }
                recompute={() => this.onRecompute()}
                save={() => this.onSave()}
                {...this.props}
                {...data}
                />
        }
    };
}

export default RoutedObjectDataWrapper;
