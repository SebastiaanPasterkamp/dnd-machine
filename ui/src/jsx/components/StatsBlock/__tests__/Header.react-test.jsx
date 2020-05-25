import React from 'react';
import renderer from 'react-test-renderer';

import Header from '../components/Header';

describe('Component: Header', () => {
    const fullProps = {
        showBonus: true,
        showFinal: true,
        increase: 2,
    };

    it('should render without props', () => {
        const tree = renderer.create(
            <Header />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
    
    it('should render with full props', () => {
        const tree = renderer.create(
            <Header {...fullProps} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
