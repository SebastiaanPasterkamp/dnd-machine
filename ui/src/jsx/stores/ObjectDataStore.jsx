import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';

export function ObjectDataStoreFactory(id, listenables = null)
{

    class ObjectDataStore extends Reflux.Store
    {
        constructor()
        {
            super();
            this.state = {
                timestamp: {}
            };
            this.listenables = listenables || ObjectDataActions;
        }

        updateObject(type, id, data, callback=null) {
            if (_.isEqual(data, _.get(this.state, [type, id]))) {
                if (callback) {
                    callback(type, id, data);
                }
                return;
            }

            let update = {
                timestamp: _.assign(
                    {},
                    this.state.timestamp,
                    {[type]: _.assign(
                        {},
                        this.state.timestamp[type],
                        {[id]: Date.now()}
                    )}
                ),
                [type]: _.assign(
                    {},
                    this.state[type],
                    {[id]: data}
                )
            };

            this.setState(update);

            if (callback) {
                _.defer(() => callback(type, id, data) );
            }
        };

        onListObjectsCompleted(type, objects, callback=null) {
            let update = {
                timestamp: {}
            };

            update = _.reduce(objects, (mapped, object) => {
                let old_object = _.get(
                        this.state,
                        [type, object.id]
                    ),
                    old_timestamp = _.get(
                        this.state.timestamp,
                        [type, object.id]
                    );

                if (old_object && _.isEqual(object, old_object)) {
                    mapped[type][object.id] = old_object;
                    mapped.timestamp[type][object.id] = old_timestamp;
                } else {
                    mapped[type][object.id] = object;
                    mapped.timestamp[type][object.id] = Date.now();
                }

                return mapped;
            }, {
                timestamp: {[type]: {}},
                [type]: {}
            });

            if (_.isEqual(update[type], _.get(this.state, type))) {
                return;
            }

            update.timestamp = _.assign(
                {},
                this.state.timestamp,
                update.timestamp
            );

            this.setState(update, callback);
        }

        onGetObjectCompleted(type, id, object, callback=null) {
            this.updateObject(type, id, object, callback);
        }

        onPatchObjectCompleted(type, id, object, callback=null) {
            this.updateObject(type, id, object, callback);
        }

        onPostObjectCompleted(type, id, object, callback=null) {
            this.updateObject(type, id, object, callback);
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
                [type]: _.omit(items, id),
            }, callback);
        }
    }

    ObjectDataStore.id = id;

    return ObjectDataStore;
};

export default ObjectDataStoreFactory('default');
