import React from 'react';

import { SelectListComponent } from '../ListComponent';

import { uuidv4 } from './utils';
import ASIOption from './ASIOption';
import ChoiceOption from './ChoiceOption';
import ConfigOption from './ConfigOption';
import DictOption from './DictOption';
import ListOption from './ListOption';
import ManualValueOption from './ManualValueOption';
import MultichoiceOption from './MultichoiceOption';
import ObjectListOption from './ObjectListOption';
import ValueOption from './ValueOption';


export class DataConfig extends React.Component
{

    configOptions = [
        {
            id: 'ability_score',
            name: 'Ability Score Improvement',
            initialItem: () => ({
                uuid: uuidv4(),
                name: "Ability Score Improvement",
                description: "You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
                limit: 2,
            }),
            component: ASIOption,
        },
        {
            id: 'dict',
            name: 'Dictionary option',
            component: DictOption,
            initialItem: () => ({
                uuid: uuidv4(),
                dict: {
                    description: "",
                },
            }),
        },
        {
            id: 'choice',
            name: 'Choice option',
            component: ChoiceOption,
        },
        {
            id: 'config',
            name: 'Config option',
            component: ConfigOption,
        },
        {
            id: 'list',
            name: 'List option',
            component: ListOption,
        },
        {
            id: 'manual',
            name: 'Manual value option',
            component: ManualValueOption,
        },
        {
            id: 'multichoice',
            name: 'Multichoice option',
            component: MultichoiceOption,
        },
        {
            id: 'objectlist',
            name: 'Object list option',
            component: ObjectListOption,
        },
        {
            id: 'value',
            name: 'Value option',
            component: ValueOption,
        },
        {
            id: 'prefab',
            name: "Prefab options",
            children: [
                {
                    id: 'asi',
                    name: 'Ability Score Increase',
                    component: ConfigOption,
                    initialItem: () => ({
                        uuid: uuidv4(),
                        type: 'config',
                        name: "Ability Score Increase",
                        description: "Your **** score increases by .",
                        config: [
                            {
                                uuid: uuidv4(),
                                type: "list",
                                path: "statistics.bonus.",
                                hidden: true,
                                multiple: true,
                            },
                        ],
                    }),
                },
                {
                    id: 'asi or feat',
                    name: 'ASI or Feat',
                    component: ChoiceOption,
                    initialItem: () => ({
                        uuid: uuidv4(),
                        type: 'choice',
                        name: "ASI or Feat",
                        options: [
                            {
                                uuid: uuidv4(),
                                type: "ability_score",
                                name: "Ability Score Improvement",
                                description: "You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
                                limit: 2,
                            },
                            {
                                uuid: uuidv4(),
                                type: "multichoice",
                                name: "Feat",
                                description: "A feat represents a talent or an area of expertise that gives a character special capabilities. It embodies training, experience, and abilities beyond what a class provides. See chapter 6 of the Player’s Handbook for more information.",
                                include: 2,
                                add: 1,
                            },
                        ],
                    }),
                },
                {
                    id: 'darkvision',
                    name: "Darkvision",
                    component: ValueOption,
                    initialItem: () => ({
                        uuid: uuidv4(),
                        type: "value",
                        path: "info.Darkvision",
                        name: "Darkvision",
                        value: "You can see in dim light within 60 feet of you as if it were bright light,\nand in darkness as if it were dim light. You can\u2019t discern\ncolor in darkness, only shades of gray.",
                    }),
                },
                {
                    id: 'equipment',
                    name: "Equipment",
                    component: ObjectListOption,
                    initialItem: () => ({
                        uuid: uuidv4(),
                        type: "objectlist",
                        path: "equipment",
                        name: "Equipment",
                        list: [ "armor", "gear", "weapon" ],
                        multiple: true,
                    }),
                },
                {
                    id: 'equipment packs',
                    name: "Equipment Packs",
                    component: ChoiceOption,
                    initialItem: () => ({
                        uuid: uuidv4(),
                        type: "choice",
                        name: "Equipment Packs",
                        include: 1,
                        filter: [
                            {
                                field: "name",
                                options: [],
                                type: "attribute",
                            },
                        ],
                        add: 1,
                    }),
                },
                {
                    id: "hit dice",
                    name: "Hit Dice",
                    component: ConfigOption,
                    initialItem: () => ({
                        uuid: uuidv4(),
                        type: "config",
                        name: "Hit Dice",
                        description: "`1d` per **** level",
                        config: [
                            {
                                uuid: uuidv4(),
                                type: "value",
                                path: "hit_dice",
                                hidden: true,
                                value: 0,
                            },
                            {
                                uuid: uuidv4(),
                                type: "config",
                                name: "Hit Points",
                                description: "* **At 1st Level**: `` + your **Constitution modifier**\n* **At Higher Levels**: `1d` (or ``) + your\n**Constitution modifier** per **** level after 1st",
                                config: [
                                    {
                                        uuid: uuidv4(),
                                        type: "value",
                                        path: "computed.hit_points.formula",
                                        hidden: true,
                                        value: "( + statistics.modifiers.constitution) + ( + statistics.modifiers.constitution) * (level - 1)"
                                    },
                                ],
                            },
                        ],
                    }),
                },
                {
                    id: 'personalities',
                    name: 'Personalities',
                    component: ConfigOption,
                    initialItem: () => ({
                        uuid: uuidv4(),
                        type: 'config',
                        name: "Suggested Characteristics",
                        description: "",
                        config: [
                            {
                                uuid: uuidv4(),
                                type: "manual",
                                path: "personality.traits",
                                name: "Personality Trait",
                            },
                            {
                                uuid: uuidv4(),
                                type: "manual",
                                path: "personality.ideals",
                                name: "Ideal",
                            },
                            {
                                uuid: uuidv4(),
                                type: "manual",
                                path: "personality.bonds",
                                name: "Bond",
                            },
                            {
                                uuid: uuidv4(),
                                type: "manual",
                                path: "personality.flaws",
                                name: "Flaw",
                            },
                        ],
                    }),
                },
                {
                    id: 'proficiencies',
                    name: 'Proficiencies',
                    children: [
                        {
                            id: 'proficiencies.armor',
                            name: "Armor Proficiency",
                            component: ObjectListOption,
                            initialItem: () => ({
                                uuid: uuidv4(),
                                type: "objectlist",
                                path: "proficiencies.armor",
                                name: "Armor Proficiency",
                                list: [ "armor_types", "armor" ],
                            }),
                        },
                        {
                            id: 'proficiencies.weapons',
                            name: "Weapon Proficiency",
                            component: ObjectListOption,
                            initialItem: () => ({
                                uuid: uuidv4(),
                                type: "objectlist",
                                path: "proficiencies.weapons",
                                name: "Weapon Proficiency",
                                list: [ "weapon_types", "weapon" ],
                            }),
                        },
                        {
                            id: 'proficiencies.languages',
                            name: "Language Proficiency",
                            component: ObjectListOption,
                            initialItem: () => ({
                                uuid: uuidv4(),
                                type: "objectlist",
                                name: "Languages",
                                path: "proficiencies.languages",
                                list: [ "languages" ],
                            }),
                        },
                        {
                            id: 'proficiencies.saving_throws',
                            name: "Saving Throws",
                            component: ObjectListOption,
                            initialItem: () => ({
                                uuid: uuidv4(),
                                type: "objectlist",
                                name: "Saving Throws",
                                path: "proficiencies.saving_throws",
                                list: [ "statistics" ],
                            }),
                        },
                        {
                            id: "proficiencies.expertise",
                            name: "Expertise (Double Proficiency)",
                            component: ObjectListOption,
                            initialItem: () => ({
                                uuid: uuidv4(),
                                type: "objectlist",
                                name: "Expertise (Double Proficiency)",
                                path: "proficiencies.expertise",
                                list: [ "skills" ],
                            }),
                        },
                        {
                            id: "proficiencies.skills",
                            name: "Skill Proficiency",
                            component: ObjectListOption,
                            initialItem: () => ({
                                uuid: uuidv4(),
                                type: "objectlist",
                                name: "Skill Proficiency",
                                path: "proficiencies.skills",
                                list: [ "skills" ],
                            }),
                        },
                        {
                            id: "proficiencies.talent",
                            name: "Talent (Half Proficiency)",
                            component: ObjectListOption,
                            initialItem: () => ({
                                uuid: uuidv4(),
                                type: "objectlist",
                                name: "Talent (Half Proficiency)",
                                path: "proficiencies.talent",
                                list: [ "skills" ],
                            }),
                        },
                        {
                            id: 'proficiencies.tools',
                            name: "Tool Proficiency",
                            component: ObjectListOption,
                            initialItem: () => ({
                                uuid: uuidv4(),
                                type: "objectlist",
                                path: "proficiencies.tools",
                                name: "Tool Proficiency",
                                list: [ "gear" ],
                            }),
                        },
                    ],
                },
                {
                    id: 'size',
                    name: "Size",
                    component: ValueOption,
                    initialItem: () => ({
                        uuid: uuidv4(),
                        type: "config",
                        name: "Size",
                        config: [
                            {
                                uuid: uuidv4(),
                                type: "value",
                                path: "size",
                                hidden: true,
                                value: "medium",
                            },
                        ],
                    }),
                },
                {
                    id: 'speed',
                    name: "Speed",
                    component: ValueOption,
                    initialItem: () => ({
                        uuid: uuidv4(),
                        type: "config",
                        name: "Speed",
                        config: [
                            {
                                uuid: uuidv4(),
                                type: "value",
                                path: "speed",
                                hidden: true,
                                value: 30,
                            }
                        ],
                    }),
                },
                {
                    id: 'spell',
                    name: 'Spells',
                    children: [
                        {
                            id: 'ability',
                            name: "Spellcasting Ability",
                            component: ConfigOption,
                            initialItem: () => ({
                                uuid: uuidv4(),
                                type: "config",
                                name: "Spellcasting Ability",
                                config: [
                                    {
                                        uuid: uuidv4(),
                                        type: "value",
                                        path: "spell.stat",
                                        hidden: true,
                                    },
                                    {
                                        uuid: uuidv4(),
                                        type: "config",
                                        name: "Spell save DC",
                                        description: "`8` + your **Proficiency bonus** + your **Casting modifier**",
                                        config: [
                                            {
                                                uuid: uuidv4(),
                                                type: "value",
                                                path: "computed.spellSafe_dc.formula",
                                                hidden: true,
                                                value: "8 + character.proficiency + statistics.modifiers.",
                                            },
                                            {
                                                uuid: uuidv4(),
                                                type: "config",
                                                description: "Your **proficiency bonus** + your **Casting modifier**",
                                                name: "Spell attack modifier",
                                                config: [
                                                    {
                                                        uuid: uuidv4(),
                                                        type: "value",
                                                        hidden: true,
                                                        path: "computed.spellAttack_modifier.formula",
                                                        value: "character.proficiency + statistics.modifiers.",
                                                    }
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            }),
                        },
                        {
                            id: 'cantrips',
                            name: "Cantrips",
                            component: ObjectListOption,
                            initialItem: () => ({
                                uuid: uuidv4(),
                                type: "objectlist",
                                path: "spell.cantrips",
                                name: "Cantrips",
                                filter: [
                                    {
                                        field: "classes",
                                        options: [],
                                        type: "attribute",
                                    },
                                    {
                                        field: "level",
                                        options: [ "Cantrip" ],
                                        type: "attribute",
                                    },
                                ],
                                limit_formula: "spell.max_cantrips",
                                list: [ "spell" ],
                            }),
                        },
                        {
                            id: 'spell.list',
                            name: "Spells",
                            component: ObjectListOption,
                            initialItem: () => ({
                                uuid: uuidv4(),
                                type: "objectlist",
                                path: "spell.list",
                                name: "Spells",
                                list: [ "spell" ],
                            }),
                        },
                        {
                            id: 'casting',
                            name: "Casting Spells",
                            component: ValueOption,
                            initialItem: () => ({
                                uuid: uuidv4(),
                                type: "value",
                                name: "Casting Spells",
                                path: "info.Casting Spells",
                            }),
                        },
                        {
                            id: 'focus',
                            name: "Spellcasting Focus",
                            component: ValueOption,
                            initialItem: () => ({
                                uuid: uuidv4(),
                                type: "value",
                                path: "info.Spellcasting Focus",
                                name: "Spellcasting Focus",
                            }),
                        },
                        {
                            id: "preparing",
                            name: "Preparing Spells",
                            component: ValueOption,
                            initialItem: () => ({
                                uuid: uuidv4(),
                                type: "dict",
                                name: "Preparing Spells",
                                path: "abilities.Preparing Spells",
                                dict: {
                                    description: "You prepare the list of spells that are available for you to cast, choosing from your spell list. When you do so, choose a number of spells equal to %(limit)s.\nThe spells must be of a level for which you have spell slots.\n\nYou can change your list of prepared spells when you finish a long rest.",
                                    limit_default: "your **Spellcasting modifier** + your class level (minimum of one spell)",
                                    limit_formula: "max(1, character.level + statistics.modifiers['spell.stat'])",
                                },
                            }),
                        },
                        {
                            id: 'ritual',
                            name: "Ritual Casting",
                            component: ValueOption,
                            initialItem: () => ({
                                uuid: uuidv4(),
                                type: "value",
                                path: "info.Ritual Casting",
                                name: "Ritual Casting",
                            }),
                        },
                    ],
                }
            ],
        }
    ];

    render() {
        return (
            <SelectListComponent
                options={this.configOptions}
                {...this.props}
            />
        );
    }
};

export default DataConfig;
