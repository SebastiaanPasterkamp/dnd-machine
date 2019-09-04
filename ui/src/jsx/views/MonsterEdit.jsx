import React from 'react';
import _ from 'lodash';

import '../../sass/_edit-monster.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
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
    }

    onFieldChange(field, value, callback=null) {
        this.props.setState({
            [field]: value
        }, callback);
    }

    render() {
        const {
            name, description = '', damage = [], target,
            target_methods = [], mode, attack_modes = [], reach,
            on_hit = '', on_mis = ''
        } = this.props;
        const damageTypes = _.get(damage, 'type');

        return <div className="edit-attack">
            <ControlGroup label="Name">
                <InputField
                    placeholder="Name..."
                    value={name}
                    setState={(value) => {
                        this.onFieldChange('name', value);
                    }} />
            </ControlGroup>
            <ControlGroup label="Description">
                <MarkdownTextField
                    placeholder="Description..."
                    value={description}
                    rows={5}
                    setState={(value) => {
                        this.onFieldChange('description', value);
                    }} />
            </ControlGroup>
            <ListComponent
                list={damage}
                component={DamageEdit}
                newItem="initial"
                keyProp="type"
                setState={(value) => {
                    this.onFieldChange('damage', value);
                }}
                componentProps={{
                    disabledTypes: damageTypes
                }}
                />
            <ControlGroup label="Target">
                <SingleSelect
                    emptyLabel="Target..."
                    selected={target}
                    items={target_methods}
                    setState={(value) => {
                        this.onFieldChange('target', value);
                    }} />
            </ControlGroup>
            <ControlGroup label="Mode">
                <SingleSelect
                    emptyLabel="Mode..."
                    selected={mode}
                    items={attack_modes}
                    setState={(value) => {
                        this.onFieldChange('mode', value);
                    }} />
            </ControlGroup>
            <ReachEdit
                {...reach}
                setState={(value) => {
                    this.onFieldChange('reach', value);
                }}
                />
            <ControlGroup label="On Hit">
                <MarkdownTextField
                    className="small"
                    placeholder="Bad stuff..."
                    value={on_hit}
                    rows={5}
                    setState={(value) => {
                        this.onFieldChange('on_hit', value);
                    }} />
            </ControlGroup>
            <ControlGroup label="On Mis">
                <MarkdownTextField
                    className="small"
                    placeholder="Still bad stuff..."
                    value={on_mis}
                    rows={5}
                    setState={(value) => {
                        this.onFieldChange('on_mis', value);
                    }} />
            </ControlGroup>
        </div>;
    }
}

class MultiAttackEditor extends React.Component
{
    constructor(props) {
        super(props);
    }

    onFieldChange(field, value, callback=null) {
        this.props.setState({
            [field]: value
        }, callback);
    }

    render() {
        const {
            name, description = '', damage = [], condition = '',
            sequence = [], attacks = []
        } = this.props;
        const attackOptions = _.map(attacks, attack => ({
            code: attack.name,
            label: attack.name
        }));

        return <div className="edit-multiattack">
            <ControlGroup label="Name">
                <InputField
                    placeholder="Rotation name..."
                    value={name}
                    setState={(value) => {
                        this.onFieldChange('name', value);
                    }} />
            </ControlGroup>
            <ControlGroup label="Description">
                <MarkdownTextField
                    placeholder="Rotation does an average of %average% damage..."
                    value={description}
                    rows={5}
                    setState={(value) => {
                        this.onFieldChange('description', value);
                    }} />
            </ControlGroup>
            <ControlGroup label="Condition">
                <MarkdownTextField
                    placeholder="Condition..."
                    value={condition}
                    rows={5}
                    setState={(value) => {
                        this.onFieldChange('condition', value);
                    }} />
            </ControlGroup>
            <TagContainer
                value={sequence}
                items={attackOptions}
                multiple={true}
                setState={(value) => {
                    this.onFieldChange('sequence', value);
                }}
                />
        </div>;
    }
}

const AttackEditor = ListDataWrapper(
    AttackEdit,
    ['target_methods', 'attack_modes'],
    'items'
);

export class MonsterEdit extends React.Component
{
    constructor(props) {
        super(props);

        this.levels = _.range(1, 30)
            .map((i) => {
                return {code: i, label: i}
            });
        this.armor_classes = _.range(10, 20)
            .map((i) => {
                return {code: i, label: i}
            });
        this.affects_rating = [
            'level',
            'armor_class',
            'attacks',
            'multiattack',
            'statistics'
        ];
        this.motion = [
            {code: 'walk', label: 'Walk'},
            {code: 'burrow', label: 'Burrow'},
            {code: 'climb', label: 'Climb'},
            {code: 'fly', label: 'Fly'},
            {code: 'swim', label: 'Swim'}
        ];
    }

    onFieldChange(field, value, callback=null) {
        const {
            [field]: oldValue,
            setState,
            recompute,
        } = this.props;

        if (_.isEqual(value, oldValue)) {
            return;
        }

        setState({
            [field]: value,
        }, () => {
            if (callback) {
                callback();
            }
            if (recompute
                && _.includes(this.affects_rating, field)
            ) {
                recompute();
            }
        });
    }

    onStatisticsChange(value) {
        let statistics = _.assign({}, this.props.statistics, value);
        this.onFieldChange('statistics', statistics);
    }

    render() {
        const {
            name, size, size_hit_dice = [], type, monster_types = [],
            alignment, alignments = [], level, armor_class,
            description = '', challenge_rating_precise = 0.0,
            xp_rating = 0, motion = {}, languages = [],
            _languages = [], traits = {}, statistics, attacks = [],
            multiattack = []
        } = this.props;

        return <React.Fragment>
            <Panel
                    key="description"
                    className="monster-edit__description"
                    header="Description"
                >
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={name}
                        setState={(value) => {
                            this.onFieldChange('name', value);
                        }} />
                </ControlGroup>
                <ControlGroup labels={["Size", "Type"]}>
                    <SingleSelect
                        emptyLabel="Size..."
                        selected={size}
                        items={size_hit_dice}
                        setState={(value) => {
                            this.onFieldChange('size', value);
                        }} />
                    <SingleSelect
                        emptyLabel="Type..."
                        selected={type}
                        items={monster_types}
                        setState={(value) => {
                            this.onFieldChange('type', value);
                        }} />
                </ControlGroup>
                <ControlGroup label="Alignment">
                    <SingleSelect
                        emptyLabel="Alignment..."
                        selected={alignment}
                        items={alignments}
                        setState={(value) => {
                            this.onFieldChange('alignment', value);
                        }} />
                </ControlGroup>
                <ControlGroup label="Level">
                    <SingleSelect
                        emptyLabel="Level..."
                        selected={level}
                        items={this.levels}
                        setState={(value) => {
                            this.onFieldChange('level', value);
                        }} />
                </ControlGroup>
                <ControlGroup label="Armor Class">
                    <SingleSelect
                        emptyLabel="Armor Class..."
                        selected={armor_class}
                        items={this.armor_classes}
                        setState={(value) => {
                            this.onFieldChange('armor_class', value);
                        }} />
                </ControlGroup>
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={description}
                        rows={5}
                        setState={(value) => {
                            this.onFieldChange('description', value);
                        }} />
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
                        setState={(value) => {
                            this.onFieldChange('motion', value);
                        }}
                        />
                </ControlGroup>
                <ControlGroup label="Languages">
                    <TagContainer
                        value={languages}
                        items={_languages}
                        setState={(value) => {
                            this.onFieldChange('languages', value);
                        }}
                        />
                </ControlGroup>
                <FormGroup label="Traits">
                    <DefinitionList
                        list={traits}
                        newItem="auto"
                        setState={(value) => {
                            this.onFieldChange('traits', value);
                        }}
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
                    } />
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
                    setState={(value, callback=null) => {
                        this.onFieldChange('attacks', value, callback);
                    }}
                    onDelete={(index, item) => {
                        const mas = _.map(multiattack, ma => {
                            if (!_.includes(ma.sequence, item.name)) {
                                return ma;
                            }
                            return _.assign({}, ma, {
                                sequence: _.pull(
                                    ma.sequence,
                                    item.name
                                )
                            });
                        });
                        this.onFieldChange('multiattack', mas);
                    }}
                    onChange={(index, beforeItem, afterItem) => {
                        const mas = _.map(multiattack, ma => {
                            if (!_.includes(ma.sequence, item.name)) {
                                return ma;
                            }
                            return _.assign({}, ma, {
                                sequence: _.map(
                                    ma.sequence,
                                    attack => (
                                        attack == beforeItem.name
                                        ? afterItem.name
                                        : attack
                                    )
                                )
                            });
                        });
                        this.onFieldChange('multiattack', mas);
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
                    setState={(value) => {
                        this.onFieldChange('multiattack', value);
                    }}
                    />
            </Panel>
        </React.Fragment>
    }
}

export default ListDataWrapper(
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
);
