import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import {ObjectDataActionsFactory} from '../actions/ObjectDataActions.jsx';
import {ObjectDataStoreFactory} from '../stores/ObjectDataStore.jsx';

import ButtonField from '../components/ButtonField.jsx';
import Panel from '../components/Panel.jsx';

function RoutedObjectDataWrapper(
    WrappedComponent, config, loadableType, loadableGroup=null
) {
    let pathPrefix = '/' + _.filter([
            loadableGroup,
            loadableType
            ]).join('/');

    return class extends Reflux.Component {
        constructor(props) {
            super(props);
            this.state = {
                buttons: config.buttons || [],
            };
            this.actions = ObjectDataActionsFactory('routed');
            this.store = ObjectDataStoreFactory(
                'routed', this.actions
            );
            this.storeKeys = [loadableType];
        }

        setButtons(buttons) {
            this.setState({buttons});
        }

        componentWillMount() {
            super.componentWillMount.call(this);

            this.setState({
                id: _.get(this.props, 'match.params.id') || null
            }, () => this.onReload());
        }

        getStateProps(state) {
            const stateProps = _.get(
                state || this.state,
                [loadableType, this.state.id]
            );
            if (_.isNil(this.state.id) && _.isNil(stateProps)) {
                return this.store.getInitial(loadableType);
            }
            return stateProps;
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (!_.isEqual(this.props, nextProps)) {
                return true;
            }

            let old_data = this.getStateProps(),
                new_data = this.getStateProps(nextState);

            if (!_.isEqual(old_data, new_data)) {
                return true;
            }

            if (!_.isEqual(this.state.buttons, nextState.buttons)) {
                return true;
            }

            return false;
        }

        nextView(id=null) {
            this.props.history.push(
                id == null
                ? pathPrefix + '/list'
                : pathPrefix + '/show/' + id
            );
        }

        onSetState(update, callback=null) {
            let loadable = _.assign(
                {},
                this.getStateProps(),
                update
                );

            this.actions.getObject.completed(
                loadableType,
                this.state.id,
                loadable
            );

            if (callback) {
                callback();
            }
        }

        onReload() {
            if (!this.state.id) {
                return;
            }
            this.actions.getObject(
                loadableType,
                this.state.id,
                loadableGroup
            );
        }

        onRecompute() {
            this.actions.recomputeObject(
                loadableType,
                this.state.id,
                this.getStateProps(),
                loadableGroup
            );
        }

        onSave() {
            if (this.state.id == null) {
                this.actions.postObject(
                    loadableType,
                    this.getStateProps(),
                    loadableGroup,
                    () => this.nextView()
                );
            } else {
                this.actions.patchObject(
                    loadableType,
                    this.state.id,
                    this.getStateProps(),
                    loadableGroup,
                    () => this.nextView()
                );
            }
        }

        handleFailed(type, id, error) {
            if (
                type != loadableType
                || id != this.state.id
            ) {
                return;
            }
            this.state({error});
            alert(error);
        }

        onPostObjectFailed(type, id, error) {
            this.handleFailed(type, id, error);
        }

        onPatchObjectFailed(type, id, error) {
            this.handleFailed(type, id, error);
        }

        onRecomputeObjectFailed(type, id, error) {
            this.handleFailed(type, id, error);
        }

        renderButtons() {
            if(!this.state.buttons.length) {
                return null;
            }

            return <Panel
                    className={config.className + "__save"}
                    header="Save"
                    >
                {_.includes(this.state.buttons, "cancel")
                    ? <ButtonField
                        name="button"
                        color="muted"
                        icon="ban"
                        onClick={() => this.nextView()}
                        label="Cancel"
                        />
                    : null
                }
                {_.includes(this.state.buttons, "reload")
                        && this.state.id != null
                    ? <ButtonField
                        name="button"
                        color="info"
                        icon="refresh"
                        onClick={() => this.onReload()}
                        label="Reload"
                        />
                    : null
                }
                {_.includes(this.state.buttons, "recompute")
                    ? <ButtonField
                        name="button"
                        color="accent"
                        icon="calculator"
                        onClick={() => this.onRecompute()}
                        label="Recompute"
                        />
                    : null
                }
                {_.includes(this.state.buttons, "save")
                    ? <ButtonField
                        name="button"
                        color="primary"
                        icon="save"
                        onClick={() => this.onSave()}
                        label="Save"
                        />
                    : null
                }
            </Panel>;
        }

        render() {
            let data = this.getStateProps();

            if(!data) {
                return null;
            }

            return <div>
                <h2 className={["icon", config.icon].join(' ')}>
                    {config.label}
                </h2>

                <div
                    className={config.className}
                    >
                    <WrappedComponent
                        setState={(state, callback=null) => {
                            this.onSetState(state, callback)
                        }}
                        setButtons={(b) => this.setButtons(b)}
                        cancel={() => this.nextView()}
                        reload={this.state.id != null
                            ? () => this.onReload()
                            : null
                        }
                        recompute={() => this.onRecompute()}
                        save={() => this.onSave()}
                        {...this.props}
                        {...data}
                        error={this.state.error || null}
                        />

                    {this.renderButtons()}
                </div>
            </div>;
        }
    };
}

export default RoutedObjectDataWrapper;
