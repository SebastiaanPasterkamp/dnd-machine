import React from 'react';
import {mount} from 'enzyme';
import renderer from 'react-test-renderer';

import {
    mockedApi,
    alignments,
    attack_modes,
    damage_types,
    languages,
    monster_types,
    size_hit_dice,
    statistics,
    target_methods,
} from '../../../../../tests/__mocks__';
import MonsterEdit from '../MonsterEdit';

describe('MonsterEdit', () => {
    const fullProps = {
        id: 1,
        campaign_id: 2,
        name: 'Brawler',
        size: 'medium',
        type: 'humanoid',
        alignment: 'chaotic neutral',
        level: 1,
        armor_class: 10,
        description: 'Punchy',
        challenge_rating_precise: 0.25,
        xp_rating: 10,
        motion: { walk: 30 },
        languages: ['common'],
        traits: {
            'Challenged': "He'll accept any challenge",
        },
        statistics: {},
        attacks: [{
            name: 'Punch',
            description: 'Fist to Face',
            damage: [
                {
                    dice_count: 1,
                    dice_size: 4,
                    bonus: 1,
                    type: 'bludgeoning'
                }
            ],
            target: 'single',
            mode: 'melee',
            reach: {
                min: 5,
                max: 5
            },
            on_hit: "It hurts",
            on_mis: "It doesn't hurt",
        }],
        multiattack: [{
            name: 'Double punch',
            description: 'We punch twice',
            condition: "We're _not_ holding a drink",
            sequence: ["Punch", "Punch"],
        }],
    };

    beforeAll(() => {
        fetch.mockImplementation(mockedApi({
            alignments,
            attack_modes,
            campaign: {
                2: { id: 2, name: "Some campaign" },
            },
            damage_types,
            languages,
            monster_types,
            size_hit_dice,
            statistics,
            target_methods,
        }));
    });

    afterAll(() => {
        fetch.resetMocks();
    });

    it('should render without props', () => {
        const setState = jest.fn();
        const tree = renderer.create(<MonsterEdit setState={setState}/>);

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(<MonsterEdit {...fullProps} setState={setState}/>);

        expect(tree).toMatchSnapshot();
    });
});
