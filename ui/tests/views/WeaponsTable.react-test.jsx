import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ListDataActions from 'actions/ListDataActions';
import {
    mockedApi,
    damage_types,
    weapon_properties,
    weapon_types,
} from '../__mocks__';

import WeaponsTable from 'views/WeaponsTable.jsx';

describe('WeaponsTable', () => {
    const fullProps = {
        weapons: {
            1: {
                id: 1,
                name: "Dagger",
                damage: {
                    dice_count: 1,
                    dice_size: 4,
                    type: "piercing",
                },
                cost: { gp: 2 },
                property: [ "thrown", "finesse", "light" ],
                range: { max: 60, min: 20 },
                type: "simple melee",
                weight: { lb: 1.0 }
            },
        },
    };

    beforeAll(() => {
        fetch.mockImplementation( mockedApi({
            damage_types,
            weapon_properties,
            weapon_types,
            user: {},
            'weapon/api': fullProps.weapons,
        }) );
        ListDataActions.fetchItems('damage_types', 'items');
        ListDataActions.fetchItems('weapon_properties', 'items');
        ListDataActions.fetchItems('weapon_types', 'items');
    })

    afterAll(() => {
        fetch.resetMocks()
    })

    describe('render', () => {
        it('should work without props', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/weapon/list`}}>
                    <WeaponsTable />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with all props', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/weapon/list`}}>
                    <WeaponsTable
                        {...fullProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });
    });

    describe('when searching', () => {
        let wrapper;

        beforeAll(() => {
            wrapper = mount(
                <MockRouter location={{pathname: `/items/weapon/list`}}>
                    <WeaponsTable
                        {...fullProps}
                    />
                </MockRouter>
            );
        });

        it('should match', () => {
            expect(wrapper
                .find('.weapons-table .base-link-group')
                .length
            ).toBe(1);

            wrapper
                .find('input[placeholder="Name..."]')
                .simulate('change', {target: {value: 'dagger'}});
            wrapper
                .find('li[data-value="thrown"] input')
                .simulate('change', {target: {checked: true}});
            wrapper
                .find('li[data-value="simple melee"] input')
                .simulate('change', {target: {checked: true}});
            wrapper
                .find('input[placeholder="Dice count"]')
                .simulate('change', {target: {value: '1'}});

            expect(wrapper
                .find('.weapons-table .base-link-group')
                .length
            ).toBe(1);
        });

        it('should filter', () => {
            expect(wrapper
                .find('.weapons-table .base-link-group')
                .length
            ).toBe(1);

            wrapper
                .find('input[placeholder="Name..."]')
                .simulate('change', {target: {value: 'mace'}});

            expect(wrapper
                .find('.weapons-table .base-link-group')
                .length
            ).toBe(0);
        });
    });
});
