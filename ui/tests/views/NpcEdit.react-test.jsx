import React from 'react';
import _ from 'lodash';
import {shallow, mount} from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';

import {NpcEdit} from '../../src/jsx/views/NpcEdit.jsx';

describe('Component: NpcEdit', () => {
    const props = {
        id: null,
        name: "Example NPC",
        location: "Somewhere",
        organization: "D&D Machine, Inc.",
        gender: "male",
        alignment: "chaotic neutral",
        size: "huge",
        level: 10,
        description: "Example NPC here",
        statistics: _.reduce(
            [
                'strength', 'dexterity', 'constitution',
                'intelligence', 'wisdom', 'charisma'
            ], (stats, stat) => {
                stats['statistics'].push({
                    name: stat, label: stat, description: stat
                });
                stats['bare'][stat] = 12;
                stats['bonus'][stat] = [1, 2];
                stats['base'][stat] = 12;
                stats['modifiers'] = -1;
                return stats;
            },
            {
                statistics: [],
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
                "name": "strength"
            }, {
                "description": "Dex",
                "label": "Dexterity",
                "name": "dexterity"
            }, {
                "description": "Con",
                "label": "Constitution",
                "name": "constitution"
            }, {
                "description": "Int",
                "label": "Intelligence",
                "name": "intelligence"
            }, {
                "description": "Wis",
                "label": "Wisdom",
                "name": "wisdom"
            }, {
                "description": "Char",
                "label": "Charisma",
                "name": "charisma"
            }
        ]));

        const tree = renderer.create(
            <NpcEdit {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
