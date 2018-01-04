import React from 'react';
import DiceNotation from '../../src/jsx/components/DiceNotation.jsx';
import renderer from 'react-test-renderer';

describe('Component: DiceNotation', () => {
    it('should show simple dice notation', () => {
        const props = {
            dice_count: 1,
            dice_size: 4
        };
        const tree = renderer.create(
            <DiceNotation {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show dice notation with bonus', () => {
        const props = {
            dice_count: 2,
            dice_size: 6,
            dice_bonus: 3
        };
        const tree = renderer.create(
            <DiceNotation {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show dice notation with type', () => {
        const props = {
            dice_count: 3,
            dice_size: 8,
            type: 'fire'
        };
        const tree = renderer.create(
            <DiceNotation {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show dice notation with bonus and type', () => {
        const props = {
            dice_count: 4,
            dice_size: 10,
            dice_bonus: 6,
            type: 'piercing'
        };
        const tree = renderer.create(
            <DiceNotation {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
