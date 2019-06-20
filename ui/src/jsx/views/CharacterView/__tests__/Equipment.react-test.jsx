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
