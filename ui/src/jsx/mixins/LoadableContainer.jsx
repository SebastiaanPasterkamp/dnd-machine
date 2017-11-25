import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import dataObjectActions from '../actions/dataObjectActions.jsx';
import dataObjectStore from '../stores/dataObjectStore.jsx';


function LoadableContainer(
    WrappedComponent, loadableType, loadableGroup=null
) {

    let initialState = dataObjectStore.getInitial(loadableType),
        pathPrefix = '/' + _.filter([
            loadableGroup,
            loadableType
            ]).join('/'),
        apiPrefix = pathPrefix + '/api',
        showPrefix = pathPrefix + '/show/';

    return class extends Reflux.Component {
        constructor(props) {
            super(props);
            this.store = dataObjectStore;

            this.mapStoreToState(dataObjectStore, (store) => {
                return _.get(
                    store,
                    [loadableType, this.state.id]
                );
            });

            this.state = initialState;
        }

        componentWillMount() {
            let objectId = _.get(this.props, 'match.params.id');
            if (_.isUndefined(objectId)) {
                return;
            }

            this.setState({
                id: objectId
            }, () => this.onReload());
        }

        nextView(id=null) {
            this.props.history.push(id == null
                ? pathPrefix
                : showPrefix + id
            );
        }

        onReload() {
            dataObjectActions.getObject(
                loadableType,
                this.state.id,
                apiPrefix
            );
        }

        onSave() {
            if (this.state.id == null) {
                dataObjectActions.postObject(
                    loadableType,
                    this.state,
                    apiPrefix,
                    () => this.nextView()
                );
            } else {
                dataObjectActions.patchObject(
                    loadableType,
                    this.state.id,
                    this.state,
                    apiPrefix,
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

        render() {
            return <WrappedComponent
                setState={(state) => this.setState(state)}
                cancel={() => this.nextView()}
                reload={this.state.id != null
                    ? () => this.onReload()
                    : null
                }
                save={() => this.onSave()}
                {...this.props}
                {...this.state}
                />
        }
    };
}

export default LoadableContainer;
