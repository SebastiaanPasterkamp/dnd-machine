import React from 'react';
import Reach from '../../jsx/components/Reach.jsx';
import renderer from 'react-test-renderer';

describe('Component: Reach', () => {
    it('should show simple number with unit', () => {
        const props = {distance: 10};
        const tree = renderer.create(
            <Reach {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show min<max range with unit', () => {
        const props = {min: 10, max: 20};
        const tree = renderer.create(
            <Reach {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a simple number for min==max with unit', () => {
        const props = {min: 5, max: 5};
        const tree = renderer.create(
            <Reach {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show just a text label for a non-numeric distance', () => {
        const props = {distance: 'touch'};
        const tree = renderer.create(
            <Reach {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
