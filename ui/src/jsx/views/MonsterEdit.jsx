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
        const dmgTypes = _.map(
            this.props.damage || [],
            damage => damage.type,
            );

        return <div className="edit-attack">
            <ControlGroup label="Name">
                <InputField
                    placeholder="Name..."
                    value={this.props.name}
                    setState={(value) => {
                        this.onFieldChange('name', value);
                    }} />
            </ControlGroup>
            <ControlGroup label="Description">
                <MarkdownTextField
                    placeholder="Description..."
                    value={this.props.description}
                    rows={5}
                    setState={(value) => {
                        this.onFieldChange('description', value);
                    }} />
            </ControlGroup>
            <ListComponent
                list={this.props.damage || [{}]}
                component={DamageEdit}
                keyProp="type"
                setState={(value) => {
                    this.onFieldChange('damage', value);
                }}
                componentProps={{
                    disabledTypes: dmgTypes
                }}
                />
            <ControlGroup label="Target">
                <SingleSelect
                    emptyLabel="Target..."
                    selected={this.props.target}
                    items={this.props.target_methods}
                    setState={(value) => {
                        this.onFieldChange('target', value);
                    }} />
            </ControlGroup>
            <ReachEdit
                {...this.props.reach}
                setState={(value) => {
                    this.onFieldChange('reach', value);
                }}
                />
            <ControlGroup label="On Hit">
                <MarkdownTextField
                    className="small"
                    placeholder="Bad stuff..."
                    value={this.props.on_hit}
                    rows={5}
                    setState={(value) => {
                        this.onFieldChange('on_hit', value);
                    }} />
            </ControlGroup>
            <ControlGroup label="On Mis">
                <MarkdownTextField
                    className="small"
                    placeholder="Still bad stuff..."
                    value={this.props.on_mis}
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
        const dmgTypes = _.map(
            this.props.damage || [],
            damage => damage.type,
            );

        return <div className="edit-multiattack">
            <ControlGroup label="Name">
                <InputField
                    placeholder="Rotation name..."
                    value={this.props.name}
                    setState={(value) => {
                        this.onFieldChange('name', value);
                    }} />
            </ControlGroup>
            <ControlGroup label="Description">
                <MarkdownTextField
                    placeholder="Rotation does an average of %average% damage..."
                    value={this.props.description}
                    rows={5}
                    setState={(value) => {
                        this.onFieldChange('description', value);
                    }} />
            </ControlGroup>
            <ControlGroup label="Condition">
                <MarkdownTextField
                    placeholder="Condition..."
                    value={this.props.condition}
                    rows={5}
                    setState={(value) => {
                        this.onFieldChange('condition', value);
                    }} />
            </ControlGroup>
            <TagContainer
                tags={this.props.sequence || []}
                tagOptions={_.map(this.props.attacks, (attack) => {
                    return {
                        code: attack.name,
                        label: attack.name
                    };
                })}
                setState={(value) => {
                    this.onFieldChange('sequence', value);
                }}
                />
        </div>;
    }
}

const AttackEditor = ListDataWrapper(
    AttackEdit,
    ['target_methods'],
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
    }

    onFieldChange(field, value, callback=null) {
        this.props.setState({
            [field]: value
        }, () => {
            if (callback) {
                callback();
            }
            if (
                this.props.recompute
                && _.includes(this.affects_rating, field)
            ) {
                this.props.recompute();
            }
        });
    }

    onStatisticsChange(value) {
        let update = _.assign({}, this.props.statistics, value);
        this.props.setState({
            statistics: update
        });
    }

    render() {
        return [
            <Panel
                    key="description"
                    className="monster-edit__description"
                    header="Description"
                >
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={this.props.name}
                        setState={(value) => {
                            this.onFieldChange('name', value);
                        }} />
                </ControlGroup>
                <ControlGroup labels={["Size", "Type"]}>
                    <SingleSelect
                        emptyLabel="Size..."
                        selected={this.props.size}
                        items={this.props.size_hit_dice}
                        setState={(value) => {
                            this.onFieldChange('size', value);
                        }} />
                    <SingleSelect
                        emptyLabel="Type..."
                        selected={this.props.type}
                        items={this.props.monster_types}
                        setState={(value) => {
                            this.onFieldChange('type', value);
                        }} />
                </ControlGroup>
                <ControlGroup label="Alignment">
                    <SingleSelect
                        emptyLabel="Alignment..."
                        selected={this.props.alignment}
                        items={this.props.alignments}
                        setState={(value) => {
                            this.onFieldChange('alignment', value);
                        }} />
                </ControlGroup>
                <ControlGroup label="Level">
                    <SingleSelect
                        emptyLabel="Level..."
                        selected={this.props.level}
                        items={this.levels}
                        setState={(value) => {
                            this.onFieldChange('level', value);
                        }} />
                </ControlGroup>
                <ControlGroup label="Armor Class">
                    <SingleSelect
                        emptyLabel="Armor Class..."
                        selected={this.props.armor_class}
                        items={this.armor_classes}
                        setState={(value) => {
                            this.onFieldChange('armor_class', value);
                        }} />
                </ControlGroup>
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={this.props.description}
                        rows={5}
                        setState={(value) => {
                            this.onFieldChange('description', value);
                        }} />
                </ControlGroup>
            </Panel>,

            <Panel
                    key="properties"
                    className="monster-edit__properties" header="Properties"
                >
                <ControlGroup labels={["Challenge Rating", "/", "XP"]}>
                    <InputField
                        value={this.props.challenge_rating}
                        disabled={true}
                        />
                    <InputField
                        value={(this.props.xp||0).toString()}
                        disabled={true}
                        />
                </ControlGroup>
                <ControlGroup label="Motion">
                    <TagValueContainer
                        tags={this.props.motion}
                        tagOptions={[
                            {code: 'walk', label: 'Walk'},
                            {code: 'burrow', label: 'Burrow'},
                            {code: 'climb', label: 'Climb'},
                            {code: 'fly', label: 'Fly'},
                            {code: 'swim', label: 'Swim'}
                        ]}
                        tagValues={this.levels}
                        defaultValue={20}
                        setState={(value) => {
                            this.onFieldChange('motion', value);
                        }}
                        />
                </ControlGroup>
                <ControlGroup label="Languages">
                    <TagContainer
                        tags={this.props.languages || []}
                        tagOptions={this.props._languages}
                        setState={(value) => {
                            this.onFieldChange('languages', value);
                        }}
                        />
                </ControlGroup>
                <FormGroup label="Traits">
                    <DefinitionList
                        list={this.props.traits || {}}
                        setState={(value) => {
                            this.onFieldChange('traits', value);
                        }}
                        />
                </FormGroup>
            </Panel>,

            <Panel
                    key="statistics"
                    className="monster-edit__statistics"
                    header="Statistics"
                >
                <StatsBlock
                    {...this.props.statistics}
                    setState={
                        (update) => this.onStatisticsChange(update)
                    } />
            </Panel>,

            <Panel
                    key="attacks"
                    className="monster-edit__attacks"
                    header="Attacks"
                >
                <ListComponent
                    component={AttackEditor}
                    list={this.props.attacks || [{}]}
                    setState={(value, callback=null) => {
                        this.onFieldChange('attacks', value, callback);
                    }}
                    onDelete={(index, item) => {
                        if (!this.props.multiattack) {
                            return;
                        }
                        const mas = _.reduce(
                            this.props.multiattack,
                            (mas, ma) => {
                                const sequence = _.reduce(
                                    ma.sequence,
                                    (sequence, attack) => {
                                        if (attack != item.name) {
                                            sequence.push(attack);
                                        }
                                        return sequence;
                                    },
                                    []
                                );
                                mas.push(_.assign(
                                    {},
                                    ma,
                                    {sequence: sequence}
                                ));
                                return mas;
                            },
                            []
                        );
                        this.onFieldChange('multiattack', mas);
                    }}
                    onChange={(index, beforeItem, afterItem) => {
                        if (!this.props.multiattack) {
                            return;
                        }
                        const mas = _.reduce(
                            this.props.multiattack,
                            (mas, ma) => {
                                const sequence = _.reduce(
                                    ma.sequence,
                                    (sequence, attack) => {
                                        if (attack == beforeItem.name) {
                                            sequence.push(afterItem.name);
                                        } else {
                                            sequence.push(attack);
                                        }
                                        return sequence;
                                    },
                                    []
                                );
                                mas.push(_.assign(
                                    {},
                                    ma,
                                    {sequence: sequence}
                                ));
                                return mas;
                            },
                            []
                        );
                        this.onFieldChange('multiattack', mas);
                    }}
                    />
            </Panel>,

            <Panel
                    key="multiattack"
                    className="monster-edit__multiattacks"
                    header="Multi Attack"
                >
                <ListComponent
                    component={MultiAttackEditor}
                    list={this.props.multiattack || [{}]}
                    componentProps={{
                        attacks: this.props.attacks || []
                    }}
                    setState={(value) => {
                        this.onFieldChange('multiattack', value);
                    }}
                    />
            </Panel>
        ];
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
