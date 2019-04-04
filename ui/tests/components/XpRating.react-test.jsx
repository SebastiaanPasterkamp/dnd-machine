import React from 'react';
import XpRating from 'components/XpRating.jsx';
import renderer from 'react-test-renderer';

describe('Component: XpRating', () => {
    it('should render without props', () => {
        const tree = renderer.create(
            <XpRating
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render "0 XP"', () => {
        const tree = renderer.create(
            <XpRating
                xpRating={0}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a rounded XP number', () => {
        const tree = renderer.create(
            <XpRating
                xpRating={13.37}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
