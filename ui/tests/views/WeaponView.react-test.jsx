import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import { mockedApi } from '../__mocks__';

import WeaponView from 'views/WeaponView.jsx';

describe('WeaponView', () => {
    const fullProps = {
        id: 1,
        name: "Rapier",
        damage: {
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
        property: [ "finesse" ],
        range: {},
        weight: { lb: 2 },
        cost: { gp: 3 },
        description: "En guarde",
    };

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
            weapon_types: [
                {
                    id: "simple melee",
                    name: "Simple Melee Weapon",
                    short: "Melee",
                },
            ],
            weapon_properties: [
                {
                    id: "finesse",
                    name: "Finesse",
                    short: "Fns",
                    description: "Use **Str** or **Dex**",
                },
            ],
            damage_types: [
                {
                    id: "slashing",
                    name: "Slashing",
                    short: "Slsh",
                    description: "Slashing damage",
                },
            ],
            current_user: {},
        }) );
    })

    afterEach(() => {
        fetch.resetMocks()
    })

    it('should render without props', () => {
        const tree = renderer.create(
            <WeaponView />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const tree = renderer.create(
            <MockRouter location={{pathname: `/items/weapon/show/${fullProps.id}`}}>
                <WeaponView {...fullProps} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });
});
