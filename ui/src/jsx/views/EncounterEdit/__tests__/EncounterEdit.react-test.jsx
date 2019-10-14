import React from 'react';
import _ from 'lodash';
import { shallow, mount } from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

jest.useFakeTimers();

import ListDataActions from 'actions/ListDataActions';
import { mockedApi, } from '../../../../../tests/__mocks__';

import { EncounterEdit } from '../EncounterEdit';

describe('View EncounterEdit', () => {
    const fullProps = {
        id: 1,
        name: 'Bar fight!',
        description: 'There is a fight in a bar',
        size: 3,
        monsters: {
            2: {
                id: 2,
                name: "Patron",
                challenge_rating_precise: 0.66,
                xp_rating: 18.33,
                hit_points: 7,
                armor_class: 12,
                average_damage: 3,
                attack_bonus: 2,
            },
        },
        monster_ids: [
            {
                id: 2,
                count: 3,
            }
        ],
        modifier: {
            monster: 1.0,
            party: 0.0,
            total: 1.0,
        },
        challenge_rating: 2,
        challenge_modified: 2.0,
        challenge_rating_precise: 2.2,
        xp: 50,
        xp_modified: 50,
        xp_rating: 55,
        hosted_party: {
            id: 4,
            size: 4,
            challenge: {
                easy: 20,
                medium: 40,
                hard: 60,
                deadly: 80,
            },
        },
    };

    beforeAll(() => fetch.mockImplementation(mockedApi({
        current_user: {},
    })));

    afterAll(() => fetch.resetMocks());

    describe('rendering', () => {
        it('should work w/ minimum props', () => {
            const onRecompute = jest.fn();
            const onSetState = jest.fn();

            const tree = renderer.create(
                <EncounterEdit
                    recompute={onRecompute}
                    setState={onSetState}
                />
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('should work with only the encounter loaded', () => {
            const onRecompute = jest.fn();
            const onSetState = jest.fn();

            const tree = renderer.create(
                <MockRouter>
                    <EncounterEdit
                        {...fullProps}
                        monsters={undefined}
                        hosted_party={undefined}
                        recompute={onRecompute}
                        setState={onSetState}
                    />
                </MockRouter>
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('should work without a party', () => {
            const onRecompute = jest.fn();
            const onSetState = jest.fn();

            const tree = renderer.create(
                <MockRouter>
                    <EncounterEdit
                        {...fullProps}
                        hosted_party={null}
                        recompute={onRecompute}
                        setState={onSetState}
                    />
                </MockRouter>
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('should work with only the party loaded', () => {
            const onRecompute = jest.fn();
            const onSetState = jest.fn();

            const tree = renderer.create(
                <MockRouter>
                    <EncounterEdit
                        hosted_party={fullProps.hosted_party}
                        recompute={onRecompute}
                        setState={onSetState}
                    />
                </MockRouter>
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('should work with only the monsters loaded', () => {
            const onRecompute = jest.fn();
            const onSetState = jest.fn();

            const tree = renderer.create(
                <MockRouter>
                    <EncounterEdit
                        monsters={fullProps.monsters}
                        recompute={onRecompute}
                        setState={onSetState}
                    />
                </MockRouter>
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('should work with all props', () => {
            const onRecompute = jest.fn();
            const onSetState = jest.fn();

            const tree = renderer.create(
                <MockRouter>
                    <EncounterEdit
                        {...fullProps}
                        recompute={onRecompute}
                        setState={onSetState}
                    />
                </MockRouter>
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });
    });

    describe('when changing the encounter', () => {
        const onRecompute = jest.fn();
        const onSetState = jest.fn();
        let wrapped;

        beforeAll(() => {
            wrapped = mount(
                <MockRouter>
                    <EncounterEdit
                        {...fullProps}
                        recompute={onRecompute}
                        setState={onSetState}
                    />
                </MockRouter>
           );
        });

        beforeEach(() => {
           onRecompute.mockClear();
           onSetState.mockClear();
        });

        it('should allow increasing the count', () => {
            wrapped
                .find('.good.fa-plus')
                .simulate('click');

            expect(onSetState).toBeCalledWith(
                {"monster_ids": [{"count": 4, "id": 2}]},
                expect.any(Function)
            );
        });

        it('should allow reducing the count', () => {
            wrapped
                .find('.warning.fa-minus')
                .simulate('click');

            expect(onSetState).toBeCalledWith(
                {"monster_ids": [{"count": 2, "id": 2}]},
                expect.any(Function)
            );
        });
    });
});
