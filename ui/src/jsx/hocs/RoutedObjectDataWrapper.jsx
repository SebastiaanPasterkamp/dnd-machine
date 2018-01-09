import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';
import ObjectDataStore from '../stores/ObjectDataStore.jsx';

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
                id: null
            };
            this.store = ObjectDataStore;
            this.storeKeys = [loadableType];
        }

        componentWillMount() {
            super.componentWillMount.call(this);

            let objectId = _.get(this.props, 'match.params.id');
            if (_.isUndefined(objectId)) {
                return;
            }

            this.setState({
                id: objectId
            }, () => this.onReload());
        }

        getStateProps(state=null) {
            state = state || this.state;

            const stored = _.get(
                state, [loadableType, this.state.id]
            );
            if (!stored || _.isEqual(stored, {id: null})) {
                return ObjectDataStore.getInitial(loadableType);
            }
            return stored;
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

            return false;
        }

        nextView(id=null) {
            this.props.history.push(id == null
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

            ObjectDataActions.getObject.completed(
                loadableType,
                this.state.id,
                loadable
            );
        }

        onReload() {
            ObjectDataActions.getObject(
                loadableType,
                this.state.id,
                loadableGroup
            );
        }

        onRecompute() {
            ObjectDataActions.recomputeObject(
                loadableType,
                this.state.id,
                this.getStateProps(),
                loadableGroup
            );
        }

        onSave() {
            if (this.state.id == null) {
                ObjectDataActions.postObject(
                    loadableType,
                    this.getStateProps(),
                    loadableGroup,
                    () => this.nextView()
                );
            } else {
                ObjectDataActions.patchObject(
                    loadableType,
                    this.state.id,
                    this.getStateProps(),
                    loadableGroup,
                    () => this.nextView()
                );
            }
        }

        onPostObjectFailed(type, id, error) {
            if (type != loadableType || id != this.state.id) {
                return;
            }
            alert(error);
        }

        onPatchObjectFailed(type, id, error) {
            if (type != loadableType || id != this.state.id) {
                return;
            }
            alert(error);
        }

        onRecomputeObjectFailed(type, id, error) {
            if (type != loadableType || id != this.state.id) {
                return;
            }
            alert(error);
        }

        renderButtons() {
            if (
                !('buttons' in config)
                || !config.buttons.length
            ) {
                return null;
            }

            return <Panel
                    className={config.className + "__save"}
                    header="Save"
                    >
                {_.includes(config.buttons, "cancel")
                    ? <ButtonField
                        name="button"
                        value="cancel"
                        color="muted"
                        icon="ban"
                        onClick={() => this.nextView()}
                        label="Cancel" />
                    : null
                }
                {_.includes(config.buttons, "reload")
                        && this.state.id != null
                    ? <ButtonField
                        name="button"
                        value="reload"
                        color="info"
                        icon="refresh"
                        onClick={() => this.onReload()}
                        label="Reload" />
                    : null
                }
                {_.includes(config.buttons, "recompute")
                    ? <ButtonField
                        name="button"
                        color="accent"
                        icon="calculator"
                        onClick={() => this.onRecompute()}
                        label="Recompute" />
                    : null
                }
                {_.includes(config.buttons, "save")
                    ? <ButtonField
                        name="button"
                        value="cancel"
                        color="primary"
                        icon="save"
                        onClick={() => this.onSave()}
                        label="Save" />
                    : null
                }
            </Panel>;
        }

        render() {
            let data = this.getStateProps();

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
                        cancel={() => this.nextView()}
                        reload={this.state.id != null
                            ? () => this.onReload()
                            : null
                        }
                        recompute={() => this.onRecompute()}
                        save={() => this.onSave()}
                        {...this.props}
                        {...data}
                        />

                    {this.renderButtons()}
                </div>
            </div>;
        }
    };
}

export default RoutedObjectDataWrapper;
