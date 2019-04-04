import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';
import ObjectDataStore from '../stores/ObjectDataStore.jsx';


function ObjectDataWrapper(
    WrappedComponent, loadables=[]
) {
    const component = class extends Reflux.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.store = ObjectDataStore;
            this.storeKeys = _.map(
                loadables,
                loadable => loadable.type
            ).concat([
                'timestamp',
            ]);
        }

        getLoadables() {
            return _.map(loadables, loadable => {
                return {
                    objectId: _.get(
                        this.props,
                        [loadable.id],
                        _.get(
                            this.props,
                            ['match', 'params', loadable.id],
                            undefined
                        )
                    ),
                    ...loadable,
                };
            });
        }

        componentDidMount() {
            const { timestamp } = this.state;

            _.forEach(this.getLoadables(), ({
                id, type, group = null, objectId,
            }) => {
                if (_.isNil(objectId)) {
                    return;
                }

                const timestamp = _.get(timestamp, [type, objectId]);
                const maxAge = Date.now() - 60.0 * 1000.0;

                if (!timestamp || timestamp < maxAge) {
                    ObjectDataActions.getObject(
                        type,
                        objectId,
                        group
                    );
                }
            });
        }

        getStateProps(state) {
            return _.reduce(this.getLoadables(), (
                loaded, {prop, type, objectId}
            ) => {
                loaded[prop || type] = _.get(state, [type, objectId]);
                return loaded;
            }, {});
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (!_.isEqual(this.props, nextProps)) {
                return true;
            }

            const old_data = this.getStateProps(this.state),
                new_data = this.getStateProps(nextState);

            if (!_.isEqual(old_data, new_data)) {
                return true;
            }

            return false;
        }

        render() {
            const data = this.getStateProps(this.state);

            return <WrappedComponent
                {...this.props}
                {...data}
                />
        }
    };

    component.WrappedComponent = WrappedComponent;

    component.displayName = `ObjectData${
        WrappedComponent.displayName
        || WrappedComponent.name
    }`;

    return component;
}

export default ObjectDataWrapper;
