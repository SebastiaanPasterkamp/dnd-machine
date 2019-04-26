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
            const { timestamps } = this.state;

            _.forEach(this.getLoadables(), ({
                id, type, group = null, objectId,
            }) => {
                if (_.isNil(objectId)) {
                    return;
                }

                const { [type]: provided = {} } = this.props;
                if (provided.id === objectId) {
                    return;
                }

                const timestamp = _.get(timestamps, [type, objectId]);
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
                const value = _.get(state, [type, objectId]);
                if (value !== undefined) {
                    loaded[prop || type] = value;
                }
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

            return (
                <WrappedComponent
                    {...this.props}
                    {...data}
                />
            );
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
