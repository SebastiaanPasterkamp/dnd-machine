import React from 'react';
import _ from 'lodash';
import { shallow, mount } from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';

jest.useFakeTimers();

import ListDataActions from 'actions/ListDataActions';
import {
    mockedApi,
    alignments,
    genders,
    size_hit_dice,
    statistics,
} from '../../../../../tests/__mocks__';

import { NpcEdit } from '../NpcEdit';

describe('View NpcEdit', () => {
    const fullProps = {
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
                statistics.bare[stat.name] = 12;
                statistics.bonus[stat.name] = [1, 2];
                statistics.base[stat.name] = 12;
                statistics.modifiers[stat.name] = -1;
                return statistics;
            },
            {
                bare: {},
                bonus: {},
                base: {},
                modifiers: {},
            }
        ),
        _statistics: statistics,
        races: [],
        classes: [],
    };

    beforeAll(() => fetch.mockImplementation(mockedApi({statistics})));

    afterAll(() => fetch.resetMocks());

    it('should render w/ minimum props', () => {
        const onRecompute = jest.fn();
        const onSetState = jest.fn();

        const tree = renderer.create(
            <NpcEdit
                recompute={onRecompute}
                setState={onSetState}
            />
        );

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should show an npc editor', () => {
        const onRecompute = jest.fn();
        const onSetState = jest.fn();

        const tree = renderer.create(
            <NpcEdit
                {...fullProps}
                recompute={onRecompute}
                setState={onSetState}
            />
        );

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
