import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
    range,
} from 'lodash/fp';

import './sass/_race-edit.scss';

import { memoize } from '../../utils';

import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import ControlGroup from '../../components/ControlGroup';
import InputField from '../../components/InputField';
import MarkdownTextField from '../../components/MarkdownTextField';
import Panel from '../../components/Panel';
import TabComponent from '../../components/TabComponent';

import {
    DataConfig,
    ListConditions,
    PhasePanel,
    uuidv4,
} from '../../components/DataConfig';

export class RaceEdit extends React.Component
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
        this.memoize = memoize.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    initPhase(level) {
        return this.memoize(`init-level-${level}`, ({name}) => {
            if (name !== '') {
                return null;
            }
            const { name: _class } = this.props;
            const levelPath = toDotCase(['sub', subclass, 'level']);

            return ({
                name: `${_class} ${level}`,
                conditions: [
                    {
                        path: levelPath,
                        type: 'eq',
                        value: level - 1,
                    },
                ],
            });
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
        const { id, name, description, config, phases } = this.props;

        return (
            <React.Fragment>
                <Panel
                    key="description"
                    className="race-edit__description"
                    header="Description"
                >
                    <ControlGroup label="Race">
                        <InputField
                            placeholder="Race..."
                            value={name}
                            setState={this.onFieldChange('name')}
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

                <Panel
                    key="levels"
                    className="race-edit__levels"
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

RaceEdit.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    config: PropTypes.arrayOf(PropTypes.object),
    phases: PropTypes.arrayOf(PropTypes.object),
};

RaceEdit.defaultProps = {
    id: null,
    config: [],
    phases: [],
    name: '',
    description: '',
};

export default RoutedObjectDataWrapper(
    RaceEdit,
    {
        className: 'race-edit',
        icon: 'fa-cube',
        label: 'Race',
        buttons: ['cancel', 'save']
    },
    "race",
    "data"
);
