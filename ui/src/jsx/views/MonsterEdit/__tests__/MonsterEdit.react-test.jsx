import React from 'react';
import {mount} from 'enzyme';
import renderer from 'react-test-renderer';

import ListDataActions from 'actions/ListDataActions';
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
        ListDataActions.fetchItems('alignments');
        ListDataActions.fetchItems('attack_modes');
        ListDataActions.fetchItems('damage_types');
        ListDataActions.fetchItems('languages');
        ListDataActions.fetchItems('monster_types');
        ListDataActions.fetchItems('size_hit_dice');
        ListDataActions.fetchItems('statistics');
        ListDataActions.fetchItems('target_methods');
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

    describe('should handle changing', () => {
        const setState = jest.fn();
        let wrapped;

        beforeAll(() => {
            wrapped = mount(
               <MonsterEdit
                   setState={setState}
               />
           );
        });

        beforeEach(() => setState.mockClear());

        it('the name', () => {
            wrapped
                .find('.monster-edit__description input')
                .simulate('change', {target: {
                    value: fullProps.name,
                }});

            expect(setState).toBeCalledWith({
                name: fullProps.name,
            }, expect.any(Function));
        });

        it('the level', () => {
            wrapped.find('.monster-edit__description li[data-value=5]').simulate('click');

            expect(setState).toBeCalledWith({
                level: 5,
            }, expect.any(Function));
        });
    });

    describe('when changing attacks', () => {
        const setState = jest.fn();
        let wrapped;

        beforeAll(() => {
            wrapped = mount(
               <MonsterEdit
                    attacks={[
                        {name: 'Punch'},
                        {name: 'Kick'},
                    ]}
                    multiattack={[
                        {
                            name: 'Drum solo',
                            sequence: ['Punch', 'Kick', 'Punch', 'Kick'],
                        },
                        {
                            name: 'Just the kick',
                            sequence: ['Kick', 'Kick'],
                        },
                    ]}
                    setState={setState}
               />
           );
        });

        beforeEach(() => setState.mockClear());

        it('should tranfer attack name changes to multiattack sequences', () => {
            wrapped.find('.edit-attack input')
                .at(0).simulate('change', {target: {value: 'Snare'}});

            expect(setState).toBeCalledWith({
                attacks: [
                    {name: 'Snare'},
                    {name: 'Kick'},
                ],
                multiattack: [
                    {
                        name: 'Drum solo',
                        sequence: ['Snare', 'Kick', 'Snare', 'Kick'],
                    },
                    {
                        name: 'Just the kick',
                        sequence: ['Kick', 'Kick'],
                    },
                ],
            }, expect.any(Function));
        });

        it('should remove deleted attacks from the multiattack sequences', () => {
            wrapped
                .find('.monster-edit__attacks .fa-minus')
                .at(1)
                .simulate('click');

            expect(setState).toBeCalledWith({
                attacks: [
                    {name: 'Kick'},
                ],
                multiattack: [
                    {
                        name: 'Drum solo',
                        sequence: ['Kick', 'Kick'],
                    },
                    {
                        name: 'Just the kick',
                        sequence: ['Kick', 'Kick'],
                    },
                ],
            }, expect.any(Function));
        });
    });
});
