import React from 'react';
import Reflux from 'reflux';

import dataObjectActions from '../actions/dataObjectActions.jsx';
import dataObjectStore from '../stores/dataObjectStore.jsx';

class LoadableContainer extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.store = dataObjectStore;
        this.mapStoreToState(dataObjectStore, (store) => {
            return _.get(
                store,
                [this.props.loadableType, this.state.id]
            );
        });
        this.state = dataObjectStore.getInitial(this.props.loadableType);
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

    onReload() {
        dataObjectActions.getObject(
            this.props.loadableType, this.state.id
        );
    }

    onSave() {
        if (this.state.id == null) {
            dataObjectActions.patchObject(
                this.props.loadableType, this.state
            );
        } else {
            dataObjectActions.postObject(
                this.props.loadableType, this.state
            );
        }
    }

    render() {
        return <this.props.component
            setState={(state) => this.setState(state)}
            reload={() => this.onReload}
            save={() => this.onSave}
            {...this.props}
            {...this.state}
            />
    }
}

export default LoadableContainer;