import React from 'react';

import ASIOption from './ASIOption';
import ChoiceOption from './ChoiceOption';
import ConfigOption from './ConfigOption';
import DictOption from './DictOption';
import ListOption from './ListOption';
import MultichoiceOption from './MultichoiceOption';
import ValueOption from './ValueOption';

export const OPTIONS = [
    {
        id: 'ability_score',
        name: 'Ability Score Improvement',
        initialItem: {
            label: "Ability Score Improvement",
            description: "You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
            type: "ability_score",
            limit: 2,
        },
        component: ASIOption,
    },
    {
        id: 'dict',
        name: 'Dictionary option',
        component: DictOption,
        initialItem: {
            dict: {
                description: '',
            },
        },
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
        id: 'multichoice',
        name: 'Multichoice option',
        component: MultichoiceOption,
    },
    {
        id: 'value',
        name: 'Value option',
        component: ValueOption,
    },
];

export default OPTIONS;
