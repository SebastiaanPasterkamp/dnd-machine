import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import dataObjectActions from '../actions/dataObjectActions.jsx';
import dataObjectStore from '../stores/dataObjectStore.jsx';


function ObjectLoader(
    WrappedComponent, loadables=[]
) {
    return class extends Reflux.Component {
        constructor(props) {
            super(props);
            this.store = dataObjectStore;

            this.mapStoreToState(dataObjectStore, (store) => {
                return _.reduce(
                    loadables,
                    (state, loadable) => {
                        state[loadable.type] = _.get(
                            store,
                            [loadable.type, this.props[loadable.id]]
                        );
                        return state;
                    },
                    {}
                );
            });

            this.state = _.reduce(
                loadables,
                (state, loadable) => {
                    state[loadable.type] = null;
                    return state;
                },
                {}
            );
        }

        componentWillMount() {
            loadables.map((loadable) => {
                if (
                    !(loadable.id in this.props)
                    || this.props[loadable.id] == undefined
                ) {
                    return;
                }

                let apiPrefix = '/'
                    + _.filter([
                        loadable.group || null,
                        loadable.type,
                        'api'
                    ]).join('/')

                dataObjectActions.getObject(
                    loadable.type,
                    this.props[loadable.id],
                    apiPrefix
                );
            });
        }

        render() {
            return <WrappedComponent
                {...this.props}
                {...this.state}
                />
        }
    };
}

export default ObjectLoader;
