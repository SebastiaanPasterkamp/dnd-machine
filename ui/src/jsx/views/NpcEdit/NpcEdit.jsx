import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './sass/_npc-edit.scss';

import ListDataWrapper from '../../hocs/ListDataWrapper';
import ObjectDataListWrapper from '../../hocs/ObjectDataListWrapper';
import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import AutoCompleteInput from '../../components/AutoCompleteInput';
import ButtonField from '../../components/ButtonField';
import ControlGroup from '../../components/ControlGroup';
import DefinitionList from '../../components/DefinitionList';
import FormGroup from '../../components/FormGroup';
import InputField from '../../components/InputField';
import Panel from '../../components/Panel';
import SingleSelect from '../../components/SingleSelect';
import StatsBlock from '../../components/StatsBlock';
import MarkdownTextField from '../../components/MarkdownTextField';

import { memoize } from '../../utils';

export class NpcEdit extends React.Component
{
    constructor(props) {
        super(props);

        this.levels = _.range(1, 30)
            .map((i) => {
                return {code: i, label: i}
            });
        this.memoize = memoize.bind(this);
        this.onStatisticsChange = this.onStatisticsChange.bind(this);
    }

    componentDidMount() {
        const { recompute } = this.props;
        if (recompute) recompute();
    }

    onFieldChange(field) {
        const { setState } = this.props;
        return this.memoize(
            field,
            (value) => setState({ [field]: value })
        );
    }

    onBaseChange(field, list) {
        return this.memoize(field, (value) => {
            const { statistics, setState, [field]: before, [list]: items } = this.props
            const oldConfig = this.getConfig(items, before);
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
        });
    }

    onStatisticsChange(value) {
        const { statistics, setState } = this.props;
        setState({
            statistics: { ...statistics, ...value }
        });
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
            name, location, organization, class: _class, classes, race, races,
            gender, genders, description, alignment, alignments, size,
            size_hit_dice, level, traits, statistics, _statistics,
            campaign_id, campaigns, currentCampaign,
        } = this.props;

        return <React.Fragment>
            <Panel
                key="description"
                className="npc-edit__description"
                header="Description"
            >
                <ControlGroup label="Campaign">
                    <SingleSelect
                        emptyLabel="Campaign..."
                        selected={campaign_id}
                        defaultValue={currentCampaign ? currentCampaign.id : null}
                        items={_.values(campaigns)}
                        setState={this.onFieldChange('campaign_id')}
                    />
                </ControlGroup>
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={name}
                        setState={this.onFieldChange('name')}
                    />
                </ControlGroup>
                <ControlGroup label="Location">
                    <InputField
                        placeholder="Location..."
                        value={location}
                        setState={this.onFieldChange('location')}
                    />
                </ControlGroup>
                <ControlGroup label="Organization">
                    <InputField
                        placeholder="Organization..."
                        value={organization}
                        setState={this.onFieldChange('organization')}
                    />
                </ControlGroup>
                <ControlGroup label="Race">
                    <AutoCompleteInput
                        placeholder="Race..."
                        value={race}
                        items={this.flattenSubs(races)}
                        setState={this.onBaseChange('race', 'races')}
                    />
                </ControlGroup>
                <ControlGroup label="Class">
                    <AutoCompleteInput
                        placeholder="Class..."
                        value={_class}
                        items={this.flattenSubs(classes)}
                        setState={this.onBaseChange('class', 'classes')}
                    />
                </ControlGroup>
                <ControlGroup label="Gender">
                    <SingleSelect
                        emptyLabel="Gender..."
                        selected={gender}
                        items={genders}
                        setState={this.onFieldChange('gender')}
                    />
                </ControlGroup>
                <ControlGroup label="Alignment">
                    <SingleSelect
                        emptyLabel="Alignment..."
                        selected={alignment}
                        items={alignments}
                        setState={this.onFieldChange('alignment')}
                    />
                </ControlGroup>
                <ControlGroup label="Size">
                    <SingleSelect
                        emptyLabel="Size..."
                        selected={size}
                        items={size_hit_dice}
                        setState={this.onFieldChange('size')}
                    />
                </ControlGroup>
                <ControlGroup label="Level">
                    <SingleSelect
                        emptyLabel="Level..."
                        selected={level}
                        items={this.levels}
                        setState={this.onFieldChange('level')}
                    />
                </ControlGroup>
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={description}
                        rows={5}
                        setState={this.onFieldChange('description')}
                    />
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
                    minBare={1}
                    setState={this.onStatisticsChange}
                />
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
                        setState={this.onFieldChange('traits')}
                    />
                </FormGroup>
            </Panel>
        </React.Fragment>;
    }
};

NpcEdit.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    campaign_id: PropTypes.number,
    campaigns: PropTypes.object,
    location: PropTypes.string,
    organization: PropTypes.string,
    class: PropTypes.string,
    classes: PropTypes.array,
    race: PropTypes.string,
    races: PropTypes.array,
    gender: PropTypes.string,
    genders: PropTypes.array,
    description: PropTypes.string,
    alignment: PropTypes.string,
    alignments: PropTypes.array,
    size: PropTypes.string,
    size_hit_dice: PropTypes.array,
    level: PropTypes.number,
    traits: PropTypes.objectOf( PropTypes.string ),
    statistics: PropTypes.object,
    _statistics: PropTypes.array,
    recompute: PropTypes.func.isRequired,
    setState: PropTypes.func.isRequired,
};

NpcEdit.defaultProps = {
    id: null,
    campaign_id: null,
    currentCampaign: {},
    campaigns: {},
    name: '',
    location: '',
    organization: '',
    class: '',
    classes: [],
    race: '',
    races: [],
    gender: '',
    genders: [],
    description: '',
    alignment: '',
    alignments: [],
    size: '',
    size_hit_dice: [],
    level: 1,
    traits: {},
    statistics: {},
    _statistics: [],
};

export default ListDataWrapper(
    ObjectDataListWrapper(
        ListDataWrapper(
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
                { statistics: '_statistics' },
            ),
            ['races', 'classes'],
            'npc'
        ),
        {campaigns: {type: 'campaign'}}
    ),
    ['current_campaign'],
    null,
    { current_campaign: 'currentCampaign' }
);
