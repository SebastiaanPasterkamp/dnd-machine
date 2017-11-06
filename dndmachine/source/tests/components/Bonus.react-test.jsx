import React from 'react';
import Bonus from '../../jsx/components/Bonus.jsx';
import renderer from 'react-test-renderer';

describe('Component: Bonus', () => {
    it('should show mdash for empty bonus', () => {
        const tree = renderer.create(
            <Bonus bonus={null} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show + before positive bonus', () => {
        const tree = renderer.create(
            <Bonus bonus={1} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show - before negative bonus', () => {
        const tree = renderer.create(
            <Bonus bonus={-1} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
