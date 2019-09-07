import React from 'react';
import _ from 'lodash';
import {shallow, mount} from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';

jest.useFakeTimers();

import ListDataActions from 'actions/ListDataActions';
import {
    mockedApi,
    alignments,
    genders,
    monster_types,
    size_hit_dice,
    statistics,
} from '../../tests/__mocks__';

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
            statistics,
            (statistics, stat) => {
                statistics.bare[stat.label] = 12;
                statistics.bonus[stat.label] = [1, 2];
                statistics.base[stat.label] = 12;
                statistics.modifiers[stat.label] = -1;
                return statistics;
            },
            {
                bare: {},
                bonus: {},
                base: {},
                modifiers: {},
            }
        )
    };

    beforeAll(() => {
        fetch.mockImplementation( mockedApi({
            statistics,
        }) );
        ListDataActions.fetchItems('statistics', 'items');

        jest.runAllTimers();
    })

    afterAll(() => {
        fetch.resetMocks()
    })

    it('should show an npc editor', () => {

        const tree = renderer.create(
            <NpcEdit {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
