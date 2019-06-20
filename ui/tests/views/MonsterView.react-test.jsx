import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';
jest.useFakeTimers();

import {
    mockedApi,
    alignments,
    attack_modes,
    monster_types,
    languages,
    size_hit_dice,
    statistics,
    target_methods,
} from '../__mocks__';
import kobol from '../__mocks__/monster.json';

import MonsterView from '../../src/jsx/views/MonsterView';

describe('MonsterView', () => {
    const user = {
        id: 2,
        name: "DM",
        role: [ "dm" ],
        username: "Dungeon Master",
    };
    const fullProps = {
        id: 1,
        name: "Floof",
        user_id: user.id,
        size: "medium",
        type: "beast",
        alignment: "true neutral",
        armor_class: 12,
        description: "Something _fluffy_!",
        challenge_rating_precise: 0.27,
        xp_rating: 10,
        motion: {
            fly: 10,
            walk: 30,
        },
        languages: [ "common" ],
        traits: {
            "Fluffy float": "It **floats**?!",
        },
        attacks: [
            {
                name: "Puff ball",
                mode: "melee",
                notation: "1d4+1",
                damage: [
                    {
                        dice_count: 1,
                        dice_size: 4,
                        bonus: 1,
                        type: "bludgeoning",
                    },
                ],
                description: "Pillow fight :)",
                average: 3,
                critical: 5,
                target: "single",
                bonus: 3,
                reach: {
                    min: 5,
                    max: 5,
                },
                on_hit: "You're floofed",
                on_miss: "",
            },
        ],
        multiattack: [
            {
                name: "Poof poof",
                description: "Double puffing",
                condition: "If attacking with *Advantage*",
                sequence: ["Puff ball", "Puff ball"],
                average: 6,
                critical: 10,
            },
        ],
        proficiency: 2,
        statistics: {
            bare: {
                strength: 5,
            },
            bonus: {},
            base: {
                strength: 5,
            },
            modifiers: {
                strength: -3,
            },
        },
    };

    beforeAll(() => {
        fetch.mockImplementation( mockedApi({
            user,
            alignments,
            attack_modes,
            languages,
            monster_types,
            size_hit_dice,
            statistics,
            target_methods,
        }) );
    })

    afterAll(() => {
        fetch.resetMocks()
    })

    it('should not render without props', () => {
        const tree = renderer.create(
            <MockRouter location={{pathname: `/monster/show/${fullProps.id}`}}>
                <MonsterView />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with minimum props', () => {
        const tree = renderer.create(
            <MockRouter location={{pathname: `/monster/show/${fullProps.id}`}}>
                <MonsterView name={fullProps.name} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const tree = renderer.create(
            <MockRouter location={{pathname: `/monster/show/${fullProps.id}`}}>
                <MonsterView {...fullProps} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render a kobol', () => {
        const tree = renderer.create(
            <MockRouter location={{pathname: `/monster/show/2`}}>
                <MonsterView id={2} {...kobol} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });
});
