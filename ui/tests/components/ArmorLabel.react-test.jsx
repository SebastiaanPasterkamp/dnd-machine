import React from 'react';
import { ArmorLabel } from 'components/ArmorLabel.jsx';
import renderer from 'react-test-renderer';

const armor_types = [
    {id: "light", name: "Light Armor"},
    {id: "heavy", name: "Heavy Armor"},
];
const light_armor = {
    id: 1,
    name: 'Example',
    description: 'Looks like a _shield_',
    type: 'light',
    cost: { gp: 100 },
    disadvantage: false,
    bonus: 2,
    requirements: {},
    weight: { lb: 5.0 },
};
const heavy_armor = {
    id: 2,
    name: 'Other Example',
    description: 'Looks **heavy** and expensive',
    type: 'heavy',
    cost: { gp: 400 },
    disadvantage: true,
    value: 16,
    formula: '14 + min(2, statistics.modifiers.dexterity)',
    requirements: { strength: 13 },
    weight: { lb: 20.0 },
};

describe('Component: ArmorLabel', () => {
    it('should render with minimum props', () => {
        const tree = renderer.create(
            <ArmorLabel
                armor_id={1}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render just the name', () => {
        const tree = renderer.create(
            <ArmorLabel
                armor_id={1}
                armor_types={armor_types}
                armor={light_armor}
                showInfo={false}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with info name', () => {
        const tree = renderer.create(
            <ArmorLabel
                armor_id={1}
                armor_types={armor_types}
                armor={light_armor}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with info and description', () => {
        const tree = renderer.create(
            <ArmorLabel
                armor_id={1}
                armor_types={armor_types}
                armor={heavy_armor}
                showDescription={true}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
    it('should render with only description', () => {
        const tree = renderer.create(
            <ArmorLabel
                armor_id={1}
                armor_types={armor_types}
                armor={heavy_armor}
                showInfo={false}
                showDescription={true}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
