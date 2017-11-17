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
            this.props.loadableType,
            this.state.id,
            this.props.loadableAPI
        );
    }

    onSave() {
        if (this.state.id == null) {
            dataObjectActions.postObject(
                this.props.loadableType,
                this.state,
                this.props.loadableAPI
            );
        } else {
            dataObjectActions.patchObject(
                this.props.loadableType,
                this.state.id,
                this.state,
                this.props.loadableAPI
            );
        }
    }

    render() {
        return <this.props.component
            setState={(state) => this.setState(state)}
            reload={this.state.id != null
                ? () => this.onReload()
                : null
            }
            save={() => this.onSave()}
            {...this.props}
            {...this.state}
            />
    }
}

export default LoadableContainer;