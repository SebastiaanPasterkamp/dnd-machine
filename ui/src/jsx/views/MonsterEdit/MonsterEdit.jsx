import React from 'react';
import PropTypes from 'prop-types';
import {
    includes,
    isEqual,
    map,
    pull,
    range,
    values,
} from 'lodash/fp';

import './sass/_monster-edit.scss';

import { memoize } from '../../utils';

import ListDataWrapper from '../../hocs/ListDataWrapper';
import ObjectDataListWrapper from '../../hocs/ObjectDataListWrapper';
import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import ControlGroup from '../../components/ControlGroup';
import DefinitionList from '../../components/DefinitionList';
import InputField from '../../components/InputField';
import FormGroup from '../../components/FormGroup';
import Panel from '../../components/Panel';
import SingleSelect from '../../components/SingleSelect';
import StatsBlock from '../../components/StatsBlock';
import ListComponent from '../../components/ListComponent';
import MarkdownTextField from '../../components/MarkdownTextField';
import TagContainer from '../../components/TagContainer';
import TagValueContainer from '../../components/TagValueContainer';

import AttackEditor from './components/AttackEditor';
import MultiAttackEditor from './components/MultiAttackEditor';

export class MonsterEdit extends React.Component
{
    constructor(props) {
        super(props);

        this.levels = map(i => ({
            code: i,
            label: i,
        }))(range(1, 30));
        this.armor_classes = map(i => ({
            code: i,
            label: i,
        }))(range(10, 20))
        this.affects_rating = [
            'level',
            'armor_class',
            'attacks',
            'multiattack',
            'statistics',
        ];
        this.motion = [
            {code: 'walk', label: 'Walk'},
            {code: 'burrow', label: 'Burrow'},
            {code: 'climb', label: 'Climb'},
            {code: 'fly', label: 'Fly'},
            {code: 'swim', label: 'Swim'},
        ];
        this.memoize = memoize.bind(this);
    }

    onFieldChange(field) {
        const {
            [field]: oldValue,
            setState,
            recompute,
        } = this.props;

        return this.memoize(
            field,
            (value, callback=null) => {
                if (isEqual(value, oldValue)) {
                    return;
                }
                setState(
                    {[field]: value},
                    () => {
                        if (callback) {
                            callback();
                        }
                        if (recompute
                            && includes(field, this.affects_rating)
                        ) {
                            recompute();
                        }
                    }
                );
            }
        );
    }

    onStatisticsChange(update) {
        const { statistics } = this.props;
        this.onFieldChange('statistics')({
            ...statistics,
            ...update,
        });
    }

    render() {
        const {
            name, size, size_hit_dice, type, monster_types,
            alignment, alignments, level, armor_class,
            description, challenge_rating_precise,
            xp_rating, motion, languages,
            _languages, traits, statistics, attacks,
            multiattack, campaign_id, campaigns,
        } = this.props;

        return <React.Fragment>
            <Panel
                key="description"
                className="monster-edit__description"
                header="Description"
            >
                <ControlGroup label="Campaign">
                    <SingleSelect
                        emptyLabel="Campaign..."
                        selected={campaign_id}
                        items={values(campaigns)}
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
                <ControlGroup labels={["Size", "Type"]}>
                    <SingleSelect
                        emptyLabel="Size..."
                        selected={size}
                        items={size_hit_dice}
                        setState={this.onFieldChange('size')}
                    />
                    <SingleSelect
                        emptyLabel="Type..."
                        selected={type}
                        items={monster_types}
                        setState={this.onFieldChange('type')}
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
                <ControlGroup label="Level">
                    <SingleSelect
                        emptyLabel="Level..."
                        selected={level}
                        items={this.levels}
                        setState={this.onFieldChange('level')}
                    />
                </ControlGroup>
                <ControlGroup label="Armor Class">
                    <SingleSelect
                        emptyLabel="Armor Class..."
                        selected={armor_class}
                        items={this.armor_classes}
                        setState={this.onFieldChange('armor_class')}
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
                    key="properties"
                    className="monster-edit__properties" header="Properties"
                >
                <ControlGroup labels={["Challenge Rating", "/", "XP"]}>
                    <InputField
                        type="float"
                        value={challenge_rating_precise}
                        disabled={true}
                    />
                    <InputField
                        type="number"
                        value={ xp_rating }
                        disabled={true}
                    />
                </ControlGroup>
                <ControlGroup label="Motion">
                    <TagValueContainer
                        value={motion}
                        items={this.motion}
                        defaultValue={30}
                        setState={this.onFieldChange('motion')}
                    />
                </ControlGroup>
                <ControlGroup label="Languages">
                    <TagContainer
                        value={languages}
                        items={_languages}
                        setState={this.onFieldChange('languages')}
                    />
                </ControlGroup>
                <FormGroup label="Traits">
                    <DefinitionList
                        list={traits}
                        newItem="auto"
                        setState={this.onFieldChange('traits')}
                    />
                </FormGroup>
            </Panel>

            <Panel
                    key="statistics"
                    className="monster-edit__statistics"
                    header="Statistics"
                >
                <StatsBlock
                    {...statistics}
                    minBare={1}
                    setState={this.onStatisticsChange.bind(this)}
                />
            </Panel>

            <Panel
                key="attacks"
                className="monster-edit__attacks"
                header="Attacks"
            >
                <ListComponent
                    component={AttackEditor}
                    list={attacks}
                    newItem="initial"
                    setState={this.onFieldChange('attacks')}
                    onDelete={(index, item) => {
                        const mas = map(ma => {
                            if (!includes(item.name, ma.sequence)) {
                                return ma;
                            }
                            return {
                                ...ma,
                                sequence: pull(
                                    item.name,
                                    ma.sequence
                                ),
                            };
                        })(multiattack);
                        this.onFieldChange('multiattack')(mas);
                    }}
                    onChange={(index, beforeItem, afterItem) => {
                        const mas = map(ma => {
                            if (!includes(item.name, ma.sequence)) {
                                return ma;
                            }
                            return {
                                ...ma,
                                sequence: map(attack => (
                                    attack == beforeItem.name
                                        ? afterItem.name
                                        : attack
                                ))(ma.sequence),
                            };
                        })(multiattack);
                        this.onFieldChange('multiattack')(mas);
                    }}
                />
            </Panel>

            <Panel
                    key="multiattack"
                    className="monster-edit__multiattacks"
                    header="Multi Attack"
                >
                <ListComponent
                    component={MultiAttackEditor}
                    list={multiattack}
                    newItem="initial"
                    componentProps={{attacks}}
                    setState={this.onFieldChange('multiattack')}
                />
            </Panel>
        </React.Fragment>
    }
}

MonsterEdit.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    campaign_id: PropTypes.number,
    campaigns: PropTypes.object,
    size: PropTypes.string,
    size_hit_dice: PropTypes.array,
    type: PropTypes.string,
    monster_types: PropTypes.array,
    alignment: PropTypes.string,
    alignments: PropTypes.array,
    level: PropTypes.number,
    armor_class: PropTypes.number,
    description: PropTypes.string,
    challenge_rating_precise: PropTypes.number,
    xp_rating: PropTypes.number,
    motion: PropTypes.object,
    languages: PropTypes.array,
    _languages: PropTypes.array,
    traits: PropTypes.object,
    statistics: PropTypes.object,
    attacks: PropTypes.array,
    multiattack: PropTypes.array,
    setState: PropTypes.func.isRequired,
    recompute: PropTypes.func,
};

MonsterEdit.defaultProps = {
    id: null,
    campaign_id: null,
    campaigns: {},
    name: '',
    size: '',
    size_hit_dice: [],
    type: '',
    monster_types: [],
    alignment: '',
    alignments: [],
    level: 1,
    armor_class: 10,
    description: '',
    challenge_rating_precise: 0.0,
    xp_rating: 0,
    motion: {},
    languages: [],
    _languages: [],
    traits: {},
    statistics: {},
    attacks: [],
    multiattack: [],
    recompute: null,
};

export default ObjectDataListWrapper(
    ListDataWrapper(
        RoutedObjectDataWrapper(
            MonsterEdit, {
                className: 'monster-edit',
                icon: 'fa-paw',
                label: 'Monster',
                buttons: ['cancel', 'reload', 'recompute', 'save']
            }, "monster"
        ),
        [
            'alignments',
            'size_hit_dice',
            'monster_types',
            'languages'
        ],
        'items',
        {'languages': '_languages'}
    ),
    {campaigns: {type: 'campaign'}}
);
