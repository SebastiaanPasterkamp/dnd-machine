import React from 'react';
import renderer from 'react-test-renderer';

import Footer from '../components/Footer';

describe('Component: Footer', () => {
    const fullProps = {
        budget: 27,
        spent: 10,
        showBonus: true,
        showFinal: true,
        increase: 2,
    };

    it('should not render without budget', () => {
        const tree = renderer.create(
            <Footer />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with only budget', () => {
        const tree = renderer.create(
            <Footer budget={fullProps.budget} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const tree = renderer.create(
            <Footer {...fullProps} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
