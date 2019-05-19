import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Equipment from '../components/Equipment';

describe('Equipment', () => {
    const fullProps = {
        armor: [
            {
                disadvantage: false,
                formula: "11 + statistics.modifiers.dexterity",
                id: 1,
                name: "Cloth",
                requirements: {},
                type: "light",
                value: 14,
                weight: {
                    lb: 1,
                },
            },
        ],
        items: {
            trinket: [
                "torch",
                "torch",
                {
                    label: "torch",
                },
                {
                    name: "torch",
                },
                "rope",
            ],
        },
        weapons: [
            {
                bonus: 4,
                damage: {
                    bonus: 2,
                    dice_count: 1,
                    dice_size: 4,
                    type: "piercing",
                },
                id: 2,
                name: "Dagger",
                property: [ "light", "thrown" ],
                range: {
                    min: 20,
                    max: 60,
                },
                type: "simple melee",
                weight: {
                    lb: 2,
                },
            },
        ],
        weapon_properties: [
            {
                code: "light",
                label: "Light",
                description: "A light weapon.",
            },
            {
                code: "thrown",
                label: "Thrown",
                description: "You can throw the weapon.",
            },
        ],
        weapon_types: [
            {
                code: "simple melee",
                label: "Simple Melee Weapon",
            },
        ],
        armor_types: [
            {
                code: "light",
                label: "Light Armor",
            },
        ],
    };

    it('should render without props', () => {
        const tree = renderer.create(
            <Equipment />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <Equipment {...fullProps} />
        );

        expect(tree).toMatchSnapshot();
    });
});
