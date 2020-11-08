import React from 'react';
import PropTypes from 'prop-types';
import {
    find,
    map,
    range,
} from 'lodash/fp';

import { memoize } from '../../utils';

import ControlGroup from '../ControlGroup';
import InputField from '../InputField';
import MarkdownTextField from '../MarkdownTextField';
import Panel from '../Panel';
import SingleSelect from '../SingleSelect';
import TabComponent from '../TabComponent';

import CasterPanel, { casterRanking } from './CasterPanel';
import DataConfig from './DataConfig';
import ListConditions from './ListConditions';
import PhasePanel from './PhasePanel';
import {
    toDotCase,
    updatePath,
    uuidv4,
} from './utils';

export class BaseEditView extends React.Component
{
    optionType = 'config';

    constructor(props) {
        super(props);
        const {
            startLevel,
            uuid = uuidv4(),
        } = props;
        this.state = {
            uuid,
            levels: map(
                (level) => ({ name: `${level + startLevel}` })
            )(range(startLevel, 20)),
        };
        this.onNameChange = this.onNameChange.bind(this);
        this.onFeaturesChange = this.onFeaturesChange.bind(this);
        this.memoize = memoize.bind(this);
    }

    initPhase(level) {
        return this.memoize(`init-level-${level}`, ({phase = {}, name}) => {
            const levelPath = toDotCase(['sub', name, 'level']);

            return ({
                name: `${name} ${level}`,
                conditions: [
                    {
                        path: levelPath,
                        type: 'eq',
                        value: level - 1,
                    },
                ],
                config: [
                ],
                ...phase,
                name: `${name} ${level}`,
            });
        });
    }

    onFeaturesChange(update) {
        const { uuid: stateUUID } = this.state;
        const { setState, features: previous, uuid = stateUUID } = this.props;
        setState({
            type: this.optionType,
            uuid,
            features: {...previous, ...update},
        });
    }

    onNameChange(name) {
        const { uuid: stateUUID, levels } = this.state;
        const {
            setState, uuid = stateUUID, startLevel,
            name: oldName, conditions, config, phases,
        } = this.props;

        const renamedPhases = map(
            (index) => this.initPhase(index + 1 + startLevel)({ phase: phases[index], name })
        )(range(0, levels.length-1));

        setState({
            type: this.optionType,
            uuid,
            name,
            ...updatePath(
                ['sub', oldName],
                ['sub', name],
                {
                    conditions,
                    config,
                    phases: renamedPhases,
                }
            ),
        });
    }

    onFieldChange(field) {
        return this.memoize(field, value => {
            const { uuid: stateUUID } = this.state;
            const { setState, uuid = stateUUID } = this.props;
            setState({
                type: this.optionType,
                uuid,
                [field]: value,
            });
        });
    }

    onPhaseChange(index) {
        return this.memoize(`phase-${index}`, phase => {
            const { uuid: stateUUID } = this.state;
            const {
                setState, startLevel, phases, uuid = stateUUID,
            } = this.props;

            const padding = map(() => ({}))(range(startLevel + 1, 20));
            setState({
                type: this.optionType,
                uuid,
                phases: [
                    ...[...phases, ...padding].slice(0, index),
                    {...phases[index], ...phase},
                    ...phases.slice(index + 1),
                ],
            });
        });
    }

    static getDerivedStateFromProps(props, state) {
        const { name, phases, startLevel } = props;
        return {
            levels: [
                { name: `${name} ${startLevel}` },
                ...map(
                    (index) => {
                        const {
                            name = `${name} ${index + 1 + startLevel}`,
                        } = phases[index] || {};
                        return { name };
                    }
                )(range(0, 20 - startLevel)),
            ],
        };
    }

    render() {
        const { levels } = this.state;
        const {
            id, baseClass, name, description, caster_rank,
            startLevel, canBeCaster, conditionsTitle,
            config, features, phases, conditions, children,
        } = this.props;
        const { casting_stat } = features;

        return (
            <React.Fragment>
                <Panel
                    key="description"
                    className={`${baseClass}__description`}
                    header="Description"
                >
                    <ControlGroup label="Name">
                        <InputField
                            placeholder="Name..."
                            value={name}
                            setState={this.onNameChange}
                        />
                    </ControlGroup>

                    { canBeCaster ? (
                        <ControlGroup label="Caster rank">
                            <SingleSelect
                                selected={caster_rank}
                                items={casterRanking}
                                setState={this.onFieldChange('caster_rank')}
                            />
                        </ControlGroup>
                    ) : null }

                    {children}

                    <ControlGroup label="Description">
                        <MarkdownTextField
                            placeholder="Description..."
                            value={description}
                            setState={this.onFieldChange('description')}
                        />
                    </ControlGroup>
                </Panel>

                { canBeCaster && caster_rank > 0 ? (
                    <CasterPanel
                        {...features}
                        configType={name}
                        setState={this.onFeaturesChange}
                    />
                ) : null }

                { conditionsTitle ? (
                    <Panel
                        key="conditions"
                        className={`${baseClass}__conditions`}
                        header={conditionsTitle}
                    >
                        <ListConditions
                            conditions={conditions}
                            setState={this.onFieldChange('conditions')}
                        />
                    </Panel>
                ) : null }

                <Panel
                    key="levels"
                    className={`${baseClass}__levels`}
                    header="Levels"
                >
                    <TabComponent
                        tabConfig={levels}
                        mountAll={true}
                    >
                        <DataConfig
                            key="phase-orig"
                            list={config}
                            setState={this.onFieldChange('config')}
                            configType={name}
                            configStat={casting_stat}
                        />
                        {map(index =>(
                            <PhasePanel
                                key={`phase-${index}`}
                                initPhase={this.initPhase(index + 1 + startLevel)}
                                {...phases[index]}
                                setState={this.onPhaseChange(index)}
                                configType={name}
                                configStat={casting_stat}
                            />
                        ))(range(0, levels.length - 1))}
                    </TabComponent>
                </Panel>
            </React.Fragment>
        );
    }
}

BaseEditView.propTypes = {
    id: PropTypes.number,
    baseClass: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    caster_rank: PropTypes.number,
    canBeCaster: PropTypes.bool,
    conditions: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string,
        value: PropTypes.number,
        min: PropTypes.value,
        max: PropTypes.value,
        needle: PropTypes.any,
        conditions: PropTypes.array,
    })),
    conditionsTitle: PropTypes.string,
    config: PropTypes.arrayOf(PropTypes.object),
    features: PropTypes.object,
    setState: PropTypes.func.isRequired,
    startLevel: PropTypes.number,
    phases: PropTypes.arrayOf(PropTypes.object),
    uuid: PropTypes.string,
};

BaseEditView.defaultProps = {
    id: null,
    baseClass: 'base-edit-view',
    name: '',
    description: '',
    caster_rank: 0,
    canBeCaster: false,
    conditions: [],
    conditionsTitle: '',
    config: [],
    features: {},
    startLevel: 1,
    uuid: undefined,
    phases: [],
};

export default BaseEditView;
