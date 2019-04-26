import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';
import ObjectDataStore from '../stores/ObjectDataStore.jsx';

function ObjectDataListWrapper(
    WrappedComponent, loadables={}
) {
    const component = class extends Reflux.Component {

        constructor(props) {
            super(props);
            this.store = Reflux.initStore(ObjectDataStore);
            this.storeKeys = _.map(loadables, (loadable) => {
                return loadable.type;
            });
        }

        componentDidMount() {
            _.forEach(
                loadables,
                ({ type, group = null }) => {
                    const { [type]: provided } = this.props;
                    if (provided === undefined) {
                        ObjectDataActions.listObjects(type, group);
                    }
                }
            );
        }

        getStateProps(state) {
            return _.reduce(
                loadables,
                (loaded, { type }, prop) => {
                    const value = _.get(state, [type]);
                    if (value !== undefined) {
                        loaded[prop] = value;
                    }
                    return loaded;
                },
                {}
            );
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

            return (
                <WrappedComponent
                    {...this.props}
                    {...data}
                />
            );
        }
    };

    component.WrappedComponent = WrappedComponent;

    component.displayName = `ObjectDataList${
        WrappedComponent.displayName
        || WrappedComponent.name
    }`;

    return component;
}

export default ObjectDataListWrapper;
