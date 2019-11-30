import React from 'react';
import Reflux from 'reflux';
import {
    defer,
    every,
    forEach,
    filter,
    get,
    isEqual,
    omit,
} from 'lodash/fp';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';
import LoadingActions from '../actions/LoadingActions.jsx';
import ReportingActions from '../actions/ReportingActions.jsx';

export function ObjectDataStoreFactory(id, listenables = null)
{

    class ObjectDataStore extends Reflux.Store
    {
        constructor()
        {
            super();
            this.state = {
                timestamp: {},
                loading: {},
            };
            this.listenables = listenables || ObjectDataActions;
        }

        updateObject(type, id, data, callback=null) {
            const {
                [type]: typeState = {},
                timestamp,
                loading,
            } = this.state;

            const state = {
                timestamp: {
                    ...timestamp,
                    [`${type}.${id}`]: Date.now(),
                },
                loading: {
                    ...loading,
                    [`${type}.${id}`]: false,
                },
            };

            if (isEqual(data, typeState[id])) {
                this.setState(state);
                if (callback) {
                    callback(type, id, typeState[id]);
                }
                return;
            }

            state[type] = {
                ...typeState,
                [id]: data,
            };
            this.setState(state);
            if (callback) {
                defer(() => callback(type, id, data));
            }
        };

        onListObjects(type, group=null, callback=null) {
            const {
                loading: {
                    [type]: loading,
                },
                timestamp: {
                    [type]: timestamp,
                },
            } = this.state;
            const maxAge = Date.now() - 60.0 * 1000.0;
            if ( loading || timestamp >= maxAge ) {
                return;
            }

            this.setState({
                loading: {
                    ...loading,
                    [type]: true,
                },
            });
            LoadingActions.start(type);

            const path = '/' + filter(null, [
                group, type, 'api'
            ]).join('/');

            fetch(path, {
                credentials: 'same-origin',
                method: 'GET',
                'headers': {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw response.statusText;
            })
            .then((result) => {
                LoadingActions.finish(type);
                this.listenables.listObjects.completed(
                    type, result, callback
                );
            })
            .catch((error) => {
                LoadingActions.finish(type);
                console.log(error);
                this.listenables.listObjects.failed(
                    type, error
                );
                ReportingActions.showMessage(
                    'bad',
                    error.message,
                    'Fetch list'
                );
            });
        }

        onListObjectsCompleted(type, objects, callback=null) {
            const {
                [type]: typeState = {},
                timestamp,
                loading,
            } = this.state;

            const update = {
                typeState: {},
                timestamp: {
                    [type]: Date.now(),
                },
                loading: {
                    [type]: false,
                },
            };

            forEach((object) => {
                const { id } = object;
                update.timestamp[`${type}.${id}`] = Date.now();
                update.loading[`${type}.${id}`] = false;
                if (!isEqual(object, typeState[id])) {
                    update.typeState[id] = object;
                }
            })(objects);

            this.setState({
                timestamp: {
                    ...timestamp,
                    ...update.timestamp,
                },
                loading: {
                    ...loading,
                    ...update.loading,
                },
                [type]: {
                    ...typeState,
                    ...update.typeState,
                },
            }, callback);
        }

        onListObjectsFailed(type) {
            const { loading } = this.state;
            this.setState({
                loading: {
                    ...loading,
                    [type]: false,
                },
            });
        }

        onGetObject(type, id, group=null, callback=null, forced=false) {
            const {
                loading,
                timestamp: {
                    [`${type}.${id}`]: timeObject = 0,
                },
            } = this.state;
            const {
                [type]: loadingList,
                [`${type}.${id}`]: loadingObject,
            } = loading;
            const maxAge = Date.now() - 60.0 * 1000.0;
            if (
                !forced && (
                    loadingList
                    || loadingObject
                    || timeObject >= maxAge
                )
            ) {
                return;
            }

            this.setState({
                loading: {
                    ...loading,
                    [`${type}.${id}`]: true,
                },
            });
            LoadingActions.start(type);

            const path = '/' + filter(null, [
                group, type, 'api', id
            ]).join('/');

            fetch(path, {
                credentials: 'same-origin',
                method: 'GET',
                'headers': {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw response.statusText;
            })
            .then((result) => {
                LoadingActions.finish(type);
                this.listenables.getObject.completed(
                    type, id, result, callback
                );
            })
            .catch((error) => {
                LoadingActions.finish(type);
                console.log(error);
                this.listenables.getObject.failed(
                    type, id, error
                );
                ReportingActions.showMessage(
                    'bad',
                    error.message,
                    'Fetch object'
                );
            });
        }

        onGetObjectCompleted(type, id, object, callback=null) {
            this.updateObject(type, id, object, callback);
        }

        onGetObjectFailed(type, id) {
            const { loading } = this.state;
            this.setState({
                loading: {
                    ...loading,
                    [`${type}.${id}`]: false,
                },
            });
        }

        onPatchObjectCompleted(type, id, object, callback=null) {
            this.updateObject(type, id, object, callback);
        }

        onPostObjectCompleted(type, id, object, callback=null) {
            const { [type]: items } = this.state;
            this.updateObject(type, id, object, callback);
            this.setState({
                [type]: omit(null, items),
            }, callback);
        }

        onConsumeObjectCompleted(type, id, object, callback=null) {
            this.updateObject(type, object.id, object, callback);
        }

        onCopyObjectCompleted(type, id, object, callback=null) {
            this.updateObject(type, object.id, object, callback);
        }

        onRecomputeObjectCompleted(type, id, object, callback=null) {
            this.updateObject(type, id, object, callback);
        }

        onDeleteObjectCompleted(type, id, callback=null) {
            const { [type]: items } = this.state;
            if (!(id in items)) {
                if (callback) {
                    callback();
                }
                return;
            }
            this.setState({
                [type]: omit(id, items),
            }, callback);
        }
    }

    ObjectDataStore.id = id;

    return ObjectDataStore;
};

export default ObjectDataStoreFactory('default');
