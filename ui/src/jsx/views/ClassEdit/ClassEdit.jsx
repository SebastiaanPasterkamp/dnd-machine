import React from 'react';
import PropTypes from 'prop-types';
import {
    fill,
    map,
    range,
    reduce,
} from 'lodash/fp';

import './sass/_class-edit.scss';

import { memoize } from '../../utils';

import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import ControlGroup from '../../components/ControlGroup';
import InputField from '../../components/InputField';
import MarkdownTextField from '../../components/MarkdownTextField';
import Panel from '../../components/Panel';
import SingleSelect from '../../components/SingleSelect';
import TabComponent from '../../components/TabComponent';

import {
    CasterPanel,
    casterRanking,
    DataConfig,
    ListConditions,
    PhasePanel,
    uuidv4,
} from '../../components/DataConfig';

export class ClassEdit extends React.Component
{
    optionType = 'config';

    constructor(props) {
        super(props);
        const { uuid = uuidv4() } = props;
        this.state = {
            uuid,
            levels: map(
                (level) => ({ name: `${level}` })
            )(range(1, 20)),
        };
        this.onFeaturesChange = this.onFeaturesChange.bind(this);
        this.memoize = memoize.bind(this);
    }

    initPhase(level) {
        return this.memoize(`init-level-${level}`, ({name}) => {
            if (name !== '') {
                return null;
            }
            const { name: _class } = this.props;

            return ({
                name: `${_class} ${level}`,
                conditions: [
                    {path: 'class', type: 'contains', needle: _class},
                    {path: 'level', type: 'gte', value: level },
                ],
            });
        });
    }

    onFeaturesChange(features) {
        const { uuid: stateUUID } = this.state;
        const { setState, features: previous, uuid = stateUUID } = this.props;
        setState({
            type: this.optionType,
            uuid,
            features: {...previous, ...update},
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
        const padding = map(() => ({}))(range(2, 20));
        return this.memoize(`phase-${index}`, phase => {
            const { uuid: stateUUID } = this.state;
            const { setState, phases, uuid = stateUUID } = this.props;
            const updated = 'config' in phase && !phase.config.length
                ? null
                : {...phases[index], ...phase};
            setState({
                type: this.optionType,
                uuid,
                phases: [
                    ...[...phases, ...padding].slice(0, index),
                    updated,
                    ...phases.slice(index + 1),
                ],
            });
        });
    }

    static getDerivedStateFromProps(props, state) {
        return {
            levels: [
                { name: `${props.name} 1`},
                ...map(
                    (index) => {
                        const {
                            name = `${index + 2}`,
                        } = props.phases[index] || {};
                        return { name };
                    }
                )(range(0, 19)),
            ],
        };
    }

    render() {
        const { levels } = this.state;
        const {
            id, name, description, caster_rank, subclass_level,
            config, features, phases, conditions,
        } = this.props;

        return (
            <React.Fragment>
                <Panel
                    key="description"
                    className="class-edit__description"
                    header="Description"
                >
                    <ControlGroup label="Class">
                        <InputField
                            placeholder="Class..."
                            value={name}
                            setState={this.onFieldChange('name')}
                        />
                    </ControlGroup>

                    <ControlGroup label="Sub class level">
                        <InputField
                            placeholder="Sub class level..."
                            min={1}
                            max={20}
                            type="number"
                            value={subclass_level}
                            setState={this.onFieldChange('subclass_level')}
                        />
                    </ControlGroup>

                    <ControlGroup label="Caster rank">
                        <SingleSelect
                            selected={caster_rank}
                            items={casterRanking}
                            setState={this.onFieldChange('caster_rank')}
                        />
                    </ControlGroup>

                    <ControlGroup label="Description">
                        <MarkdownTextField
                            placeholder="Description..."
                            value={description}
                            setState={this.onFieldChange('description')}
                        />
                    </ControlGroup>
                </Panel>

                { caster_rank > 0 ? (
                    <CasterPanel
                        {...features}
                        setState={this.onFeaturesChange}
                    />
                ) : null }

                <Panel
                    key="conditions"
                    className="class-edit__conditions"
                    header="Multiclassing requirements"
                >
                    <ListConditions
                        conditions={conditions}
                        setState={this.onFieldChange('conditions')}
                    />
                </Panel>

                <Panel
                    key="levels"
                    className="class-edit__levels"
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
                        />
                        {map(
                            (index) =>(<PhasePanel
                                key={`phase-${index}`}
                                initPhase={this.initPhase(index + 2)}
                                {...phases[index]}
                                setState={this.onPhaseChange(index)}
                            />)
                        )(range(0, levels.length-1))}
                    </TabComponent>
                </Panel>
            </React.Fragment>
        );
    }
}

ClassEdit.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    caster_rank: PropTypes.number,
    subclass_level: PropTypes.number,
    conditions: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string,
        value: PropTypes.number,
        min: PropTypes.value,
        max: PropTypes.value,
        needle: PropTypes.any,
        conditions: PropTypes.array,
    })),
    config: PropTypes.arrayOf(PropTypes.object),
    phases: PropTypes.arrayOf(PropTypes.object),
    features: PropTypes.object,
};

ClassEdit.defaultProps = {
    id: null,
    name: '',
    description: '',
    caster_rank: 0,
    subclass_level: 1,
    conditions: [],
    config: [],
    phases: [],
    features: {},
};

export default RoutedObjectDataWrapper(
    ClassEdit,
    {
        className: 'class-edit',
        icon: 'fa-user',
        label: 'Class',
        buttons: ['cancel', 'save']
    },
    "class",
    "data"
);
