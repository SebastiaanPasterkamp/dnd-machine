import React from 'react';
import PropTypes from 'prop-types';
import {
    get,
    includes,
    isEqual,
    map,
    pull,
    range,
    values,
} from 'lodash/fp';

import '../../sass/_edit-monster.scss';

import { memoize } from '../utils.jsx';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import ButtonField from '../components/ButtonField.jsx';
import DamageEdit from '../components/DamageEdit.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import DefinitionList from '../components/DefinitionList.jsx';
import InputField from '../components/InputField.jsx';
import FormGroup from '../components/FormGroup.jsx';
import Panel from '../components/Panel.jsx';
import ReachEdit from '../components/ReachEdit.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import StatsBlock from '../components/StatsBlock.jsx';
import ListComponent from '../components/ListComponent.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import TagContainer from '../components/TagContainer.jsx';
import TagValueContainer from '../components/TagValueContainer.jsx';

class AttackEdit extends React.Component
{
    constructor(props) {
        super(props);
        this.memoize = memoize.bind(this);
    }

    onFieldChange(field) {
        const { setState } = this.props;
        return this.memoize(
            field,
            (value, callback=null) => setState(
                {[field]: value },
                callback
            )
        );
    }

    render() {
        const {
            name, description, damage, target, target_methods,
            mode, attack_modes, reach, on_hit, on_mis,
        } = this.props;
        const damageTypes = get('type', damage);

        return <div className="edit-attack">
            <ControlGroup label="Name">
                <InputField
                    placeholder="Name..."
                    value={name}
                    setState={this.onFieldChange('name')}
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
            <ListComponent
                list={damage}
                component={DamageEdit}
                newItem="initial"
                keyProp="type"
                setState={this.onFieldChange('damage')}
                componentProps={{
                    disabledTypes: damageTypes
                }}
            />
            <ControlGroup label="Target">
                <SingleSelect
                    emptyLabel="Target..."
                    selected={target}
                    items={target_methods}
                    setState={this.onFieldChange('target')}
                />
            </ControlGroup>
            <ControlGroup label="Mode">
                <SingleSelect
                    emptyLabel="Mode..."
                    selected={mode}
                    items={attack_modes}
                    setState={this.onFieldChange('mode')}
                />
            </ControlGroup>
            <ReachEdit
                {...reach}
                setState={this.onFieldChange('reach')}
            />
            <ControlGroup label="On Hit">
                <MarkdownTextField
                    className="small"
                    placeholder="Bad stuff..."
                    value={on_hit}
                    rows={5}
                    setState={this.onFieldChange('on_hit')}
                />
            </ControlGroup>
            <ControlGroup label="On Mis">
                <MarkdownTextField
                    className="small"
                    placeholder="Still bad stuff..."
                    value={on_mis}
                    rows={5}
                    setState={this.onFieldChange('on_mis')}
                />
            </ControlGroup>
        </div>;
    }
}

AttackEdit.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    damage: PropTypes.array,
    target: PropTypes.string,
    target_methods: PropTypes.array,
    mode: PropTypes.string,
    attack_modes: PropTypes.array,
    reach: PropTypes.object,
    on_hit: PropTypes.string,
    on_mis: PropTypes.string,
    setState: PropTypes.func.isRequired,
};

AttackEdit.defaultProps = {
    name: '',
    description: '',
    damage: [],
    target: '',
    target_methods: [],
    mode: '',
    attack_modes: [],
    reach: {},
    on_hit: '',
    on_mis: '',
};

const AttackEditor = ListDataWrapper(
    AttackEdit,
    ['target_methods', 'attack_modes'],
    'items'
);

class MultiAttackEditor extends React.Component
{
    constructor(props) {
        super(props);
        this.memoize = memoize.bind(this);
    }

    onFieldChange(field) {
        const { setState } = this.props;
        return this.memoize(
            field,
            (value, callback=null) => setState(
                {[field]: value },
                callback
            )
        );
    }

    render() {
        const {
            name, description, damage, condition = '',
            sequence = [], attacks = []
        } = this.props;
        const attackOptions = map(attack => ({
            code: attack.name,
            label: attack.name
        }))(attacks);

        return <div className="edit-multiattack">
            <ControlGroup label="Name">
                <InputField
                    placeholder="Rotation name..."
                    value={name}
                    setState={this.onFieldChange('name')}
                />
            </ControlGroup>
            <ControlGroup label="Description">
                <MarkdownTextField
                    placeholder="Rotation does an average of %average% damage..."
                    value={description}
                    rows={5}
                    setState={this.onFieldChange('description')}
                />
            </ControlGroup>
            <ControlGroup label="Condition">
                <MarkdownTextField
                    placeholder="Condition..."
                    value={condition}
                    rows={5}
                    setState={this.onFieldChange('condition')}
                />
            </ControlGroup>
            <TagContainer
                value={sequence}
                items={attackOptions}
                multiple={true}
                setState={this.onFieldChange('sequence')}
            />
        </div>;
    }
}

MultiAttackEditor.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    damage: PropTypes.array,
    condition: PropTypes.string,
    sequence: PropTypes.array,
    attacks: PropTypes.array,
    attack_modes: PropTypes.array,
    reach: PropTypes.object,
    on_hit: PropTypes.string,
    on_mis: PropTypes.string,
    setState: PropTypes.func.isRequired,
};

MultiAttackEditor.defaultProps = {
    name: '',
    description: '',
    damage: [],
    condition: '',
    sequence: [],
    attacks: [],
};

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

    onStatisticsChange(value) {
        let statistics = {
            ...this.props.statistics,
            ...value,
        };
        this.onFieldChange('statistics')(statistics);
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
                    setState={
                        (update) => this.onStatisticsChange(update)
                    }
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
