import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';
import ObjectDataStore from '../stores/ObjectDataStore.jsx';


function ObjectDataWrapper(
    WrappedComponent, loadables=[]
) {
    return class extends Reflux.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.store = ObjectDataStore;
            this.storeKeys = _.map(loadables, (loadable) => {
                return loadable.type;
            });
        }

        componentDidMount() {
            _.map(loadables, (loadable) => {
                let prop_id = this.props[loadable.id] || undefined,
                    object = _.get(this.state, [loadable.type, prop_id]);

                if (prop_id == undefined) {
                    return;
                }

                if (object != null) {
                    return;
                }

                ObjectDataActions.getObject(
                    loadable.type,
                    prop_id,
                    loadable.group || null
                );
            });
        }

        getStateProps(state) {
            return _.reduce(loadables, (loaded, loadable) => {
                loaded[loadable.prop || loadable.type] = _.get(
                    state, [loadable.type, this.props[loadable.id]]
                );
                return loaded;
            }, {});
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

        render() {
            let data = this.getStateProps(this.state);

            return <WrappedComponent
                {...this.props}
                {...data}
                />
        }
    };
}

export default ObjectDataWrapper;
