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

    getApiPrefix() {
        return '/' + [
            this.props.loadableGroup || this.props.loadableType,
            'api'
            ].join('/');
    }

    nextView(id=null) {
        let path = '/' + [
            this.props.loadableGroup,
            this.props.loadableType
            ].join('/');

        if (id != null) {
            path = '/' + [
                this.props.loadableGroup,
                'show',
                id
            ].join('/');
        }

        this.props.history.push(path);
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
            this.getApiPrefix()
        );
    }

    onSave() {
        if (this.state.id == null) {
            dataObjectActions.postObject(
                this.props.loadableType,
                this.state,
                this.getApiPrefix(),
                () => this.nextView()
            );
        } else {
            dataObjectActions.patchObject(
                this.props.loadableType,
                this.state.id,
                this.state,
                this.getApiPrefix(),
                () => this.nextView()
           );
        }
    }

    onPostObjectCompleted(type, id, result) {
        if (
            type != this.props.loadableType
            || this.state.id != null
        ) {
            return;
        }
        this.nextView(id);
    }

    onPostObjectFailed(type, id, error) {
        if (
            type != this.props.loadableType
            || id != this.state.id
        ) {
            return;
        }
        alert(error);
    }

    onPatchObjectCompleted(type, id, result) {
        if (
            type != this.props.loadableType
            || id != this.state.id
        ) {
            return;
        }
        this.nextView(id);
    }

    onPatchObjectFailed(type, id, error) {
        if (
            type != this.props.loadableType
            || id != this.state.id
        ) {
            return;
        }
        alert(error);
    }

    render() {
        return <this.props.component
            setState={(state) => this.setState(state)}
            cancel={() => this.nextView()}
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