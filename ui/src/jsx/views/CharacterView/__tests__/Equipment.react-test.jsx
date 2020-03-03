import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Equipment from '../components/Equipment';
import { armor, items, weapons, } from '../__mocks__/character';

describe('Equipment', () => {
    const fullProps = {
        armor,
        items,
        weapons,
        weapon_properties: [
            {
                id: "light",
                name: "Light",
                description: "A light weapon.",
            },
            {
                id: "thrown",
                name: "Thrown",
                description: "You can throw the weapon.",
            },
        ],
        weapon_types: [
            {
                id: "simple melee",
                name: "Simple Melee Weapon",
            },
        ],
        armor_types: [
            {
                id: "light",
                name: "Light Armor",
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
