import React from 'react';
import Reflux from 'reflux';
import {
    forEach,
    isEqual,
    isNil,
    map,
    reduce,
} from 'lodash/fp';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';
import ObjectDataStore from '../stores/ObjectDataStore.jsx';

const ObjectDataWrapper = function(
    WrappedComponent, loadables=[]
) {
    const component = class extends Reflux.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.store = ObjectDataStore;
            this.storeKeys = map((loadable) => loadable.type)(loadables);
        }

        getLoadables() {
            return map((loadable) => {
                const {
                    [loadable.id]: propId,
                    match: {
                        params: {
                            [loadable.id]: matchId,
                        } = {},
                    } = {},
                } = this.props;
                return {
                    ...loadable,
                    objectId: propId === undefined
                        ? matchId
                        : propId
                };
            })(loadables);
        }

        componentDidMount() {
            forEach(({ id, type, group = null, objectId }) => {
                if (isNil(objectId)) {
                    return;
                }

                const {
                    [type]: provided = {}
                } = this.props;
                if (provided.id === objectId) {
                    return;
                }

                ObjectDataActions.getObject(
                    type,
                    objectId,
                    group
                );
            })(this.getLoadables());
        }

        getStateProps(state) {
            return reduce(
                ( loaded, {prop, type, objectId} ) => {
                    const {
                        [type]: {
                            [objectId]: object,
                        } = {},
                    } = state || this.state;
                    if (object !== undefined) {
                        loaded[prop || type] = object;
                    }
                    return loaded;
                },
                {}
            )(this.getLoadables());
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (!isEqual(this.props, nextProps)) {
                return true;
            }

            const old_data = this.getStateProps(this.state),
                new_data = this.getStateProps(nextState);

            if (!isEqual(old_data, new_data)) {
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
