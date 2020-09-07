import React from 'react';
import {
    lowerCase,
    startCase,
} from 'lodash/fp';

import { SelectListComponent } from '../ListComponent';

import {
    toDotCase,
    toCamelCase,
    uuidv4,
} from './utils';
import ASIOption from './ASIOption';
import ChoiceOption from './ChoiceOption';
import ConfigOption from './ConfigOption';
import DictOption from './DictOption';
import LevelingOption from './LevelingOption';
import ListOption from './ListOption';
import ManualValueOption from './ManualValueOption';
import MultichoiceOption from './MultichoiceOption';
import ObjectListOption from './ObjectListOption';
import PermanentOption from './PermanentOption';
import ValueOption from './ValueOption';

export class DataConfig extends React.Component
{

    configOptions = [
        {
            id: 'ability_score',
            name: 'Ability Score Improvement',
            initialItem: ({ configType, configStat }) => ({
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
            initialItem: ({ configType, configStat }) => ({
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
            id: 'leveling',
            name: 'Leveling option',
            component: LevelingOption,
            initialItem: ({ configType, configStat }) => ({
                uuid: uuidv4(),
                type: 'leveling',
                path: toDotCase(['sub', configType, 'leveling']),
            }),
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
            id: 'permanent',
            name: 'Permanent Config Options',
            component: PermanentOption,
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
                    initialItem: ({ configType, configStat }) => ({
                        uuid: uuidv4(),
                        type: 'config',
                        name: "Ability Score Increase",
                        description: `Your **STAT** score increases by \`AMOUNT\`.`,
                        config: [
                            {
                                uuid: uuidv4(),
                                type: "list",
                                path: 'statistics.bonus.STAT',
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
                    initialItem: ({ configType, configStat }) => ({
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
                    initialItem: ({ configType, configStat }) => ({
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
                    initialItem: ({ configType, configStat }) => ({
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
                    initialItem: ({ configType, configStat }) => ({
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
                    initialItem: ({ configType, configStat }) => ({
                        uuid: uuidv4(),
                        type: "config",
                        name: "Hit Dice",
                        description: `\`1d#\` per **${configType}** level`,
                        config: [
                            {
                                uuid: uuidv4(),
                                type: "value",
                                path: toDotCase(['sub', configType, 'hit_dice']),
                                hidden: true,
                                value: 0,
                            },
                            {
                                uuid: uuidv4(),
                                type: "config",
                                name: "Hit Points at First Level",
                                description: "`#` + your **Constitution modifier**",
                                config: [
                                    {
                                        uuid: uuidv4(),
                                        type: "list",
                                        path: "computed.hit_points.formulas",
                                        hidden: true,
                                        given: [
                                            toDotCase(['sub', configType, 'hit_dice']),
                                        ],
                                    },
                                    {
                                        uuid: uuidv4(),
                                        type: "list",
                                        path: "computed.hit_points.bonus",
                                        hidden: true,
                                        multiple: true,
                                        given: [
                                            "statistics.modifiers.constitution * character.level",
                                        ],
                                    },
                                ],
                                conditions: [
                                    {
                                        value: 1,
                                        path: "character.level",
                                        type: "lre",
                                    }
                                ],
                            },
                            {
                                uuid: uuidv4(),
                                type: "config",
                                name: "Hit Points at Higher Levels",
                                description: `\`1d#\` (\`#\`) + your **Constitution modifier** per level after 1st`,
                                config: [
                                    {
                                        uuid: uuidv4(),
                                        type: "list",
                                        path: "computed.hit_points.bonus",
                                        given: [
                                            `# * (${toDotCase(['sub', configType, 'hit_dice'])} - 1)`,
                                        ],
                                        hidden: true,
                                        multiple: true,
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
                    initialItem: ({ configType, configStat }) => ({
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
                            initialItem: ({ configType, configStat }) => ({
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
                            initialItem: ({ configType, configStat }) => ({
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
                            initialItem: ({ configType, configStat }) => ({
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
                            initialItem: ({ configType, configStat }) => ({
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
                            initialItem: ({ configType, configStat }) => ({
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
                            initialItem: ({ configType, configStat }) => ({
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
                            initialItem: ({ configType, configStat }) => ({
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
                            initialItem: ({ configType, configStat }) => ({
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
                    initialItem: ({ configType, configStat }) => ({
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
                    initialItem: ({ configType, configStat }) => ({
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
                            initialItem: ({ configType, configStat }) => ({
                                uuid: uuidv4(),
                                type: "config",
                                name: "Spellcasting Ability",
                                config: [
                                    {
                                        uuid: uuidv4(),
                                        type: "value",
                                        path: toDotCase(['sub', configType, 'spell', 'stat']),
                                        hidden: true,
                                    },
                                    {
                                        uuid: uuidv4(),
                                        type: "config",
                                        name: "Spell save DC",
                                        description: `\`8\` + your **Proficiency bonus** + your **${startCase(configStat)} modifier**`,
                                        config: [
                                            {
                                                uuid: uuidv4(),
                                                type: "list",
                                                path: `computed.${toCamelCase(['sub', configType, 'spell', 'safe_dc'])}.formulas`,
                                                hidden: true,
                                                given: [
                                                    `8 + character.proficiency + ${toDotCase(['statistics', 'modifiers', configStat])}`,
                                                ],
                                            },
                                            {
                                                uuid: uuidv4(),
                                                type: "config",
                                                description: `Your **Proficiency bonus** + your **${startCase(configStat)} modifier**`,
                                                name: "Spell attack modifier",
                                                config: [
                                                    {
                                                        uuid: uuidv4(),
                                                        type: "list",
                                                        hidden: true,
                                                        path: `computed.${toCamelCase(['sub', configType, 'spell', 'attack_modifier'])}.formulas`,
                                                        given: [
                                                            `character.proficiency + ${toDotCase(['statistics', 'modifiers', configStat])}`,
                                                        ],
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
                            initialItem: ({ configType, configStat }) => ({
                                uuid: uuidv4(),
                                type: "objectlist",
                                path: toDotCase(['sub', configType, 'spell', 'cantrips']),
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
                            initialItem: ({ configType, configStat }) => ({
                                uuid: uuidv4(),
                                type: "objectlist",
                                path: toDotCase(['sub', configType, 'spell', 'list']),
                                name: "Spells",
                                list: [ "spell" ],
                            }),
                        },
                        {
                            id: 'casting',
                            name: "Casting Spells",
                            component: ValueOption,
                            initialItem: ({ configType, configStat }) => ({
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
                            initialItem: ({ configType, configStat }) => ({
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
                            initialItem: ({ configType, configStat }) => ({
                                uuid: uuidv4(),
                                type: "dict",
                                name: "Preparing Spells",
                                path: "abilities.Preparing Spells",
                                dict: {
                                    description: "You prepare the list of spells that are available for you to cast, choosing from your spell list. When you do so, choose a number of spells equal to %(limit)s.\nThe spells must be of a level for which you have spell slots.\n\nYou can change your list of prepared spells when you finish a long rest.",
                                    limit_default: `your **Spellcasting modifier** + your **${configType}** level (minimum of one spell)`,
                                    limit_formula: `max(1, ${toDotCase(['sub', configType, 'level'])} + ${toDotCase(['statistics', 'modifiers', configStat])}`,
                                },
                            }),
                        },
                        {
                            id: 'ritual',
                            name: "Ritual Casting",
                            component: ValueOption,
                            initialItem: ({ configType, configStat }) => ({
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
