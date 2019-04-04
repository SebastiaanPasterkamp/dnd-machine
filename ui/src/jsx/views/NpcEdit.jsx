import React from 'react';
import _ from 'lodash';

import '../../sass/_edit-npc.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import AutoCompleteInput from '../components/AutoCompleteInput.jsx';
import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import DefinitionList from '../components/DefinitionList.jsx';
import FormGroup from '../components/FormGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import {StatsBlock} from '../components/StatsBlock.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';

export class NpcEdit extends React.Component
{
    constructor(props) {
        super(props);

        this.levels = _.range(1, 30)
            .map((i) => {
                return {code: i, label: i}
            });
    }

    onFieldChange(field, value) {
        this.props.setState({
            [field]: value
        });
    }

    onBaseChange(field, items, value) {
        const { statistics, setState } = this.props
        const oldConfig = this.getConfig(items, this.props[field]);
        const newConfig = this.getConfig(items, value);
        const emptyBonus = _.reduce(
            statistics.base,
            (emptyBonus, value, key) => {
                emptyBonus[key] = [];
                return emptyBonus;
            },
            {}
        );

        let newState = _.assign(
            {},
            _.reduce(
                oldConfig || {},
                (reset, value, key) => {
                    reset[key] = undefined;
                    return reset;
                },
                {}
            ),
            newConfig,
            {
                statistics,
                hit_dice: 8,
                [field]: value,
            }
        );

        if (oldConfig && oldConfig.statistics) {
            newState.statistics.bonus = emptyBonus;
        }

        if (newConfig && newConfig.statistics) {
            newState.statistics.bonus = _.assign(
                {},
                emptyBonus,
                newConfig.statistics.bonus
            );
        }

        setState(newState);
    }

    onStatisticsChange(value) {
        const statistics = _.assign(
            {},
            this.props.statistics,
            value
        );
        this.props.setState({statistics});
    }

    getConfig(items, name) {
        return _.reduce(
            items,
            (config, item) => {
                if (
                    item.name != name
                    && !_.some(item.sub, {name})
                ) {
                    return config;
                }
                config = _.merge(config, item.config);
                _.reduce(
                    item.sub,
                    (config, sub) => {
                        if (sub.name != name) {
                            return config;
                        }
                        return _.merge(config, sub.config);
                    },
                    config
                );
                return config;
            },
            {}
        );
    }

    flattenSubs(items) {
        return _.reduce(
            items,
            (result, item) => {
                return _.concat(
                    result,
                    _.map(
                        item.sub || [item],
                        sub => ({
                            code: sub.name,
                            label: sub.name,
                        })
                    )
                );
            },
            []
        );
    }

    render() {
        const {
            name, location, organization, 'class': _class,
            classes = [], race, races = [], gender, genders = [],
            description = '', alignment, alignments = [], size,
            size_hit_dice = [], level, traits = {}, statistics,
            _statistics = []
        } = this.props;

        return <React.Fragment>
            <Panel
                key="description"
                className="npc-edit__description"
                header="Description"
                >
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={name}
                        setState={
                            (value) => this.onFieldChange('name', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Location">
                    <InputField
                        placeholder="Location..."
                        value={location}
                        setState={
                            (value) => this.onFieldChange('location', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Organization">
                    <InputField
                        placeholder="Organization..."
                        value={organization}
                        setState={
                            (value) => this.onFieldChange('organization', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Race">
                    <SingleSelect
                        emptyLabel="Race..."
                        selected={race}
                        items={this.flattenSubs(races)}
                        setState={
                            (value) => this.onBaseChange('race', races, value)
                        } />
                </ControlGroup>
                <ControlGroup label="Class">
                    <AutoCompleteInput
                        placeholder="Class..."
                        value={_class}
                        items={this.flattenSubs(classes)}
                        setState={
                            (value) => this.onBaseChange('class', classes, value)
                        } />
                </ControlGroup>
                <ControlGroup label="Gender">
                    <SingleSelect
                        emptyLabel="Gender..."
                        selected={gender}
                        items={genders}
                        setState={
                            (value) => this.onFieldChange('gender', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Alignment">
                    <SingleSelect
                        emptyLabel="Alignment..."
                        selected={alignment}
                        items={alignments}
                        setState={
                            (value) => this.onFieldChange('alignment', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Size">
                    <SingleSelect
                        emptyLabel="Size..."
                        selected={size}
                        items={size_hit_dice}
                        setState={
                            (value) => this.onFieldChange('size', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Level">
                    <SingleSelect
                        emptyLabel="Level..."
                        selected={level}
                        items={this.levels}
                        setState={
                            (value) => this.onFieldChange('level', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={description}
                        rows={5}
                        setState={
                            (value) => this.onFieldChange('description', value)
                        } />
                </ControlGroup>
            </Panel>

            <Panel
                key="statistics"
                className="npc-edit__statistics"
                header="Statistics"
                >
                <StatsBlock
                    {...statistics}
                    statistics={_statistics}
                    setState={
                        (update) => this.onStatisticsChange(update)
                    } />
            </Panel>

            <Panel
                key="properties"
                className="npc-edit__properties"
                header="Properties"
                >
                <FormGroup label="Traits">
                    <DefinitionList
                        list={traits}
                        newItem="initial"
                        setState={(value) => {
                            this.onFieldChange('traits', value);
                        }}
                        />
                </FormGroup>
            </Panel>
        </React.Fragment>;
    }
}

export default ListDataWrapper(
    ListDataWrapper(
        RoutedObjectDataWrapper(
            NpcEdit, {
                className: 'npc-edit',
                icon: 'fa-commenting-o',
                label: 'NPC',
                buttons: ['cancel', 'reload', 'recompute', 'save']
            }, "npc"
        ),
        [
            'alignments',
            'genders',
            'size_hit_dice',
            'statistics',
        ],
        'items',
        {'statistics': '_statistics'}
    ),
    ['races', 'classes'],
    'npc'
);
