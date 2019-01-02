import React from 'react';
import _ from 'lodash';
import {shallow, mount} from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';

import {statistics, alignments, genders, size_hit_dice} from '../__mocks__/apiCalls.js';

import {NpcEdit} from '../../src/jsx/views/NpcEdit.jsx';

describe('View NpcEdit', () => {
    const props = {
        id: null,
        name: "Example NPC",
        location: "Somewhere",
        organization: "D&D Machine, Inc.",
        gender: "male",
        genders,
        alignment: "chaotic neutral",
        alignments,
        size: "huge",
        size_hit_dice,
        level: 10,
        description: "Example NPC here",
        statistics: _.reduce(
            [
                'strength', 'dexterity', 'constitution',
                'intelligence', 'wisdom', 'charisma'
            ], (statistics, stat) => {
                statistics.bare[stat] = 12;
                statistics.bonus[stat] = [1, 2];
                statistics.base[stat] = 12;
                statistics.modifiers[stat] = -1;
                return statistics;
            },
            {
                bare: {},
                bonus: {},
                base: {},
                modifiers: {}
            }
        )
    };

    it('should show an npc editor', () => {

        fetch.mockResponseOnce(JSON.stringify([
            {
                "description": "Str",
                "label": "Strength",
                "code": "strength"
            }, {
                "description": "Dex",
                "label": "Dexterity",
                "code": "dexterity"
            }, {
                "description": "Con",
                "label": "Constitution",
                "code": "constitution"
            }, {
                "description": "Int",
                "label": "Intelligence",
                "code": "intelligence"
            }, {
                "description": "Wis",
                "label": "Wisdom",
                "code": "wisdom"
            }, {
                "description": "Char",
                "label": "Charisma",
                "code": "charisma"
            }
        ]));

        const tree = renderer.create(
            <NpcEdit {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
