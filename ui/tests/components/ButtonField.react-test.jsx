import React from 'react';
import ButtonField from '../../src/jsx/components/ButtonField.jsx';
import renderer from 'react-test-renderer';

describe('Component: ButtonField', () => {
    it('should show a simple button', () => {
        const tree = renderer.create(
            <ButtonField />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show an icon button', () => {
        const tree = renderer.create(
            <ButtonField
                icon="thumbs-up"
                label="Okay"
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a colored button', () => {
        const tree = renderer.create(
            <ButtonField
                color="good"
                label="Good"
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a custom button', () => {
        const tree = renderer.create(
            <ButtonField
                className="special"
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
