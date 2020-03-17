import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
    range,
} from 'lodash/fp';

import './sass/_sub-race-edit.scss';

import { memoize } from '../../utils';

import ListDataWrapper from '../../hocs/ListDataWrapper';
import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import ControlGroup from '../../components/ControlGroup';
import InputField from '../../components/InputField';
import MarkdownTextField from '../../components/MarkdownTextField';
import Panel from '../../components/Panel';
import SingleSelect from '../../components/SingleSelect';
import TabComponent from '../../components/TabComponent';

import {
    DataConfig,
    PhasePanel,
    uuidv4,
} from '../../components/DataConfig';

export class SubRaceEdit extends React.Component
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
        this.onPhaseChange = this.onPhaseChange.bind(this);
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
        const { id, race_id, name, description, config, phases, races } = this.props;

        return (
            <React.Fragment>
                <Panel
                    key="description"
                    className="sub-race-edit__description"
                    header="Description"
                >
                    <ControlGroup label="Race">
                        <SingleSelect
                            selected={race_id}
                            items={races}
                            setState={this.onFieldChange('race_id')}
                        />
                    </ControlGroup>

                    <ControlGroup label="Sub Race">
                        <InputField
                            placeholder="Sub Race..."
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
                    key="config"
                    className="sub-race-edit__config"
                    header="Config"
                >
                    <TabComponent
                        tabConfig={levels}
                        mountAll={true}
                    >
                        <DataConfig
                            list={config}
                            setState={this.onFieldChange('config')}
                        />
                        {map(
                            (index) =>(<PhasePanel
                                key={`phase-${index}`}
                                level={index + 2}
                                class={name}
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

SubRaceEdit.propTypes = {
    id: PropTypes.number,
    race_id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    config: PropTypes.arrayOf(PropTypes.object),
    phases: PropTypes.arrayOf(PropTypes.object),
    description: PropTypes.string,
    races: PropTypes.array,
};

SubRaceEdit.defaultProps = {
    race_id: null,
    name: '',
    description: '',
    config: [],
    phases: [],
    classes: [],
};

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        SubRaceEdit,
        {
            className: 'sub-race-edit',
            icon: 'fa-cubes',
            label: 'Sub Races',
            buttons: ['cancel', 'save']
        },
        ["subrace"],
        "data",
    ),
    ["race"],
    "data",
    {
        race: "races",
    },
);
