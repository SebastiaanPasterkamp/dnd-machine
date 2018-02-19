import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import ReportingActions from '../actions/ReportingActions.jsx';
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
                loadable,
                callback
            );
        }

        onReload(callback=null) {
            if (!this.state.id) {
                return;
            }
            this.actions.getObject(
                loadableType,
                this.state.id,
                loadableGroup,
                callback
            );
        }

        onRecompute(callback=null) {
            this.actions.recomputeObject(
                loadableType,
                this.state.id,
                this.getStateProps(),
                loadableGroup,
                callback
            );
        }

        onSave(callback=null) {
            if (this.state.id == null) {
                this.actions.postObject(
                    loadableType,
                    this.getStateProps(),
                    loadableGroup,
                    () => {
                        ReportingActions.showMessage(
                            'good',
                            'Created',
                            config.label,
                            10
                        );
                        if (callback) {
                            callback();
                        }
                        this.nextView(this.state.id);
                    }
                );
            } else {
                this.actions.patchObject(
                    loadableType,
                    this.state.id,
                    this.getStateProps(),
                    loadableGroup,
                    () => {
                        ReportingActions.showMessage(
                            'good',
                            'Updated',
                            config.label,
                            10
                        );
                        if (callback) {
                            callback();
                        }
                        this.nextView(this.state.id);
                    }
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
            ReportingActions.showMessage(
                'bad',
                config.label,
                error,
                10
            );
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
            const {
                id, buttons
            } = this.state;
            if(!buttons.length) {
                return null;
            }

            return <Panel
                    className={config.className + "__save"}
                    header="Save"
                    >
                {_.includes(buttons, "cancel")
                    ? <ButtonField
                        name="button"
                        color="muted"
                        icon="ban"
                        onClick={() => this.nextView(id)}
                        label="Cancel"
                        />
                    : null
                }
                {_.includes(buttons, "reload")
                        && id != null
                    ? <ButtonField
                        name="button"
                        color="info"
                        icon="refresh"
                        onClick={() => this.onReload(() => {
                            ReportingActions.showMessage(
                                'info',
                                'Reloaded',
                                config.label,
                                5
                            );
                        })}
                        label="Reload"
                        />
                    : null
                }
                {_.includes(buttons, "recompute")
                    ? <ButtonField
                        name="button"
                        color="accent"
                        icon="calculator"
                        onClick={() => this.onRecompute(() => {
                            ReportingActions.showMessage(
                                'info',
                                'Recomputed',
                                config.label,
                                5
                            );
                        })}
                        label="Recompute"
                        />
                    : null
                }
                {_.includes(buttons, "save")
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
            const {
                id, error
            } = this.state;
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
                        reload={id != null
                            ? (callback=null) => this.onReload(callback)
                            : null
                        }
                        recompute={(callback=null) => {
                            this.onRecompute(callback);
                        }}
                        save={(callback=null) => {
                            this.onSave(callback);
                        }}
                        {...this.props}
                        {...data}
                        error={error || null}
                        />

                    {this.renderButtons()}
                </div>
            </div>;
        }
    };
}

export default RoutedObjectDataWrapper;
