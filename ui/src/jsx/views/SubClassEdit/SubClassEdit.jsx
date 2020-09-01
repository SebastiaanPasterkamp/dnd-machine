import React from 'react';
import PropTypes from 'prop-types';
import {
    find,
    map,
    range,
} from 'lodash/fp';

import './sass/_sub-class-edit.scss';

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
    CasterPanel,
    casterRanking,
    DataConfig,
    ListConditions,
    PhasePanel,
    uuidv4,
} from '../../components/DataConfig';

export class SubClassEdit extends React.Component
{
    optionType = 'config';

    constructor(props) {
        super(props);
        const {
            class_id,
            classes,
            uuid = uuidv4(),
        } = props;
        const {
            subclass_level = 1,
            caster_rank: class_caster_rank = 0,
        } = find({id: class_id}, classes) || {};
        this.state = {
            uuid,
            levels: map(
                (level) => ({ name: `${level}` })
            )(range(subclass_level, 20)),
            subclass_level,
            class_caster_rank,
        };
        this.onFeaturesChange = this.onFeaturesChange.bind(this);
        this.memoize = memoize.bind(this);
    }

    initPhase(level) {
        return this.memoize(`init-level-${level}`, ({name = ''}) => {
            if (name !== '') {
                return null;
            }
            const { name: subclass } = this.props;
            const levelPath = `sub.${subclass.toLowerCase()}.level`;

            return ({
                name: `${subclass} ${level}`,
                conditions: [
                    {path: levelPath, type: 'gte', value: level },
                ],
                config: [
                    {
                        hidden: true,
                        path: levelPath,
                        type: "value",
                        uuid: uuidv4(),
                        value: level,
                    },
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
        const { class_id, classes } = props;
        const { caster_rank } = state;
        const {
            subclass_level = 1,
            caster_rank: class_caster_rank = 0,
        } = find({id: class_id}, classes) || {};
        return {
            levels: [
                { name: `${props.name} ${subclass_level}` },
                ...map(
                    (index) => {
                        const {
                            name = `${index + 1 + subclass_level}`,
                        } = props.phases[index] || {};
                        return { name };
                    }
                )(range(0, 20 - subclass_level)),
            ],
            subclass_level,
            class_caster_rank,
            caster_rank: class_caster_rank > 0 ? 0 : caster_rank,
        };
    }

    render() {
        const { levels, subclass_level, class_caster_rank } = this.state;
        const {
            id, class_id, name, description, caster_rank,
            config, phases, conditions, classes,
        } = this.props;

        return (
            <React.Fragment>
                <Panel
                    key="description"
                    className="sub-class-edit__description"
                    header="Description"
                >
                    <ControlGroup label="Class">
                        <SingleSelect
                            selected={class_id}
                            items={classes}
                            setState={this.onFieldChange('class_id')}
                        />
                    </ControlGroup>

                    <ControlGroup label="Sub Class">
                        <InputField
                            placeholder="Sub Class..."
                            value={name}
                            setState={this.onFieldChange('name')}
                        />
                    </ControlGroup>

                    { !class_caster_rank ? (
                        <ControlGroup label="Caster rank">
                            <SingleSelect
                                selected={caster_rank}
                                items={casterRanking}
                                setState={this.onFieldChange('caster_rank')}
                            />
                        </ControlGroup>
                    ) : null }

                    <ControlGroup label="Description">
                        <MarkdownTextField
                            placeholder="Description..."
                            value={description}
                            setState={this.onFieldChange('description')}
                        />
                    </ControlGroup>
                </Panel>

                { !class_caster_rank && caster_rank > 0 ? (
                    <CasterPanel
                        {...features}
                        setState={this.onFeaturesChange}
                    />
                ) : null }

                <Panel
                    key="conditions"
                    className="sub-class-edit__conditions"
                    header="Conditions"
                >
                    <ListConditions
                        conditions={conditions}
                        setState={this.onFieldChange('conditions')}
                    />
                </Panel>

                <Panel
                    key="levels"
                    className="sub-class-edit__levels"
                    header="Levels"
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
                                initPhase={this.initPhase(index + 1 + subclass_level)}
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

SubClassEdit.propTypes = {
    id: PropTypes.number,
    class_id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    caster_rank: PropTypes.number,
    config: PropTypes.arrayOf(PropTypes.object),
    phases: PropTypes.arrayOf(PropTypes.object),
    description: PropTypes.string,
    classes: PropTypes.array,
};

SubClassEdit.defaultProps = {
    class_id: null,
    name: '',
    description: '',
    caster_rank: 0,
    config: [],
    phases: [],
    classes: [],
};

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        SubClassEdit,
        {
            className: 'sub-class-edit',
            icon: 'fa-users',
            label: 'Sub Class',
            buttons: ['cancel', 'save']
        },
        "subclass",
        "data"
    ),
    ['class'],
    'data',
    {
        'class': 'classes',
    },
);
