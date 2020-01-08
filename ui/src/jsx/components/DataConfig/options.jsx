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
        label: 'Ability Score Improvement',
        initialItem: {
            "label": "Ability Score Improvement",
            "description": "You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
            "type": "ability_score",
            "limit": 2,
        },
        component: ASIOption,
    },
    {
        id: 'dict',
        label: 'Dictionary option',
        component: DictOption,
        initialItem: {
            dict: {
                description: '',
            },
        },
    },
    {
        id: 'choice',
        label: 'Choice option',
        component: ChoiceOption,
    },
    {
        id: 'config',
        label: 'Config option',
        component: ConfigOption,
    },
    {
        id: 'list',
        label: 'List option',
        component: ListOption,
    },
    {
        id: 'multichoice',
        label: 'Multichoice option',
        component: MultichoiceOption,
    },
    {
        id: 'value',
        label: 'Value option',
        component: ValueOption,
    },
];

export default OPTIONS;
