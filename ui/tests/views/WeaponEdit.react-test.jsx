import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ListDataActions from 'actions/ListDataActions';
import {
    mockedApi,
} from '../__mocks__';

import WeaponEdit from 'views/WeaponEdit.jsx';

describe('WeaponEdit', () => {
    const fullProps = {
        id: 1,
        name: "Rapier",
        damage: {
            bonus: undefined,
            dice_count: 1,
            dice_size: 6,
            type: "slashing",
        },
        versatile: {
            dice_count: 1,
            dice_size: 8,
            type: "slashing",
        },
        type: "simple melee",
        property: [ "finesse", "versatile", "special" ],
        weight: {lb: 2 },
        cost: { gp: 3 },
        description: "En guarde",
    };

    beforeAll(() => {
        fetch.mockImplementation( mockedApi({
            weapon_types: [
                {
                    code: "simple melee",
                    label: "Simple Melee Weapon",
                    short: "Melee",
                },
                {
                    code: "simple ranged",
                    label: "Simple Ranged Weapon",
                    short: "Ranged",
                },
            ],
            weapon_properties: [
                {
                    code: "finesse",
                    label: "Finesse",
                    short: "Fns",
                    description: "Use **Str** or **Dex**",
                },
                {
                    code: "versatile",
                    label: "Versatile",
                    short: "Vstl",
                    description: "1 or 2 hands",
                },
                {
                    code: "special",
                    label: "Special",
                    short: "Spcl",
                    description: "Extra rules",
                },
                {
                    code: "thrown",
                    label: "Thrown",
                    short: "Trwn",
                    description: "Airborn",
                },
            ],
            damage_types: [
                {
                    code: "slashing",
                    label: "Slashing",
                    short: "Slsh",
                    description: "Slashing damage",
                },
            ],
            current_user: {},
        }) );
        ListDataActions.fetchItems('weapon_types', 'items');
        ListDataActions.fetchItems('weapon_properties', 'items');
        ListDataActions.fetchItems('damage_types', 'items');
        ListDataActions.fetchItems('current_user');
    });

    afterAll(() => fetch.resetMocks());

    it('should render without props', () => {
        const tree = renderer.create(
            <WeaponEdit.WrappedComponent.WrappedComponent />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const tree = renderer.create(
            <MockRouter location={{pathname: `/items/weapon/edit/${fullProps.id}`}}>
                <WeaponEdit.WrappedComponent.WrappedComponent {...fullProps} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    describe('when editing the basics', () => {
        let wrapper;
        let component;
        const setState = jest.fn();

        beforeAll(() => {
            wrapper = mount(
                <MockRouter location={{pathname: `/items/weapon/new`}}>
                    <WeaponEdit setState={setState}/>
                </MockRouter>
            );
            component = wrapper.find(WeaponEdit);
        });

        afterEach(() => setState.mockClear());

        it('can change the name', () => {
            const { name } = fullProps;
            wrapper
                .find('input[placeholder="Name..."]')
                .simulate('change', {target: {value: name}});
            expect(setState).toBeCalledWith({ name });
        });

        it('can change the type', () => {
            const type = 'simple ranged';
            wrapper
                .find(`li[data-value="${type}"]`)
                .simulate('click');
            expect(setState).toBeCalledWith({
                type,
                range: {min: 5, max: 5},
            });
        });

        it('can change the damage value', () => {
            const { damage } = fullProps;
            wrapper
                .find(`li[data-value=${damage.dice_count}]`)
                .at(0)
                .simulate('click');
            expect(setState).toBeCalledWith({ damage: {
                bonus: undefined,
                dice_count: damage.dice_count,
                dice_size: 4,
                type: "piercing",
            }});
            wrapper
                .find(`li[data-value=${damage.dice_size}]`)
                .at(1)
                .simulate('click');
            expect(setState).toBeCalledWith({ damage: {
                bonus: undefined,
                dice_count: 1,
                dice_size: damage.dice_size,
                type: "piercing",
            }});
            wrapper
                .find(`li[data-value="${damage.type}"]`)
                .at(0)
                .simulate('click');
            expect(setState).toBeCalledWith({ damage: {
                bonus: undefined,
                dice_count: 1,
                dice_size: 4,
                type: damage.type,
            }});
        });

        it('should set properties', () => {
            const { damage } = fullProps;

            wrapper
                .find('li[data-value="thrown"]')
                .simulate('click');
            expect(setState).toBeCalledWith({
                property: ['thrown'],
                range: {min: 5, max: 5},
            });

            wrapper
                .find('li[data-value="versatile"]')
                .simulate('click');
            expect(setState).toBeCalledWith({
                property: ['versatile'],
                versatile: {
                    dice_count: 1,
                    dice_size: 4,
                    type: "piercing",
                },
            });

            wrapper
                .find('li[data-value="special"]')
                .simulate('click');
            expect(setState).toBeCalledWith({
                property: ['special'],
                description: "",
            });
        });
    });

    it('when loading invalid combinations', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <MockRouter location={{pathname: '/items/weapon/new'}}>
                <WeaponEdit
                    setState={setState}
                    type="simple melee"
                    property={[]}
                    range={{min: 30, max: 60}}
                    versatile={fullProps.versatile}
                    description="Not very special"
                />
            </MockRouter>
        );

        expect(setState).toBeCalledWith({
            range: undefined,
            versatile: undefined,
            description: undefined,
        });
    });
});
