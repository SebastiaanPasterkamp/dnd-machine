import React from 'react';
import Reflux from 'reflux';
import {
    forEach,
    isEqual,
    keys,
    map,
    reduce,
} from 'lodash/fp';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';
import ObjectDataStore from '../stores/ObjectDataStore.jsx';

function ObjectDataListWrapper(
    WrappedComponent, loadables={}
) {
    const component = class extends Reflux.Component {

        constructor(props) {
            super(props);
            this.state = {};
            this.store = Reflux.initStore(ObjectDataStore);
            this.storeKeys = map((loadable) => loadable.type)(loadables);
        }

        componentDidMount() {
            forEach((prop) => {
                const { type, group = null } = loadables[prop];

                const {
                    [prop]: provided,
                } = this.props;

                if (provided !== undefined) {
                    return;
                }

                ObjectDataActions.listObjects(type, group);
            })(keys(loadables));
        }

        getStateProps(state) {
            return reduce(
                (loaded, prop) => {
                    const { type } = loadables[prop];
                    const { [type]: list } = state;
                    if (list !== undefined) {
                        loaded[prop] = list;
                    }
                    return loaded;
                },
                {}
            )(keys(loadables));
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (!isEqual(this.props, nextProps)) {
                return true;
            }

            let old_data = this.getStateProps(this.state),
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

    component.displayName = `ObjectDataList${
        WrappedComponent.displayName
        || WrappedComponent.name
    }`;

    return component;
}

export default ObjectDataListWrapper;
