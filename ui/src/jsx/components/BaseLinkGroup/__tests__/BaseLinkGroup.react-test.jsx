import React from 'react';
import renderer from 'react-test-renderer';

import BaseLinkGroup from '../BaseLinkGroup.jsx';

describe('Component: BaseLinkGroup', () => {
    describe('should render', () => {
        it('without props', () => {
            const tree = renderer.create(
                <BaseLinkGroup />
            );

            expect(tree).toMatchSnapshot();
        });

        it('with one child', () => {
            const tree = renderer.create(
                <BaseLinkGroup>
                    <div name="child">
                        Child
                    </div>
                </BaseLinkGroup>
            );

            expect(tree).toMatchSnapshot();
        });
    });

    describe('should filter using', () => {
        it('include list', () => {
            const tree = renderer.create(
                <BaseLinkGroup include={['include']}>
                    <div name="include">
                        Included
                    </div>
                    <div name="exclude">
                        Excluded
                    </div>
                    <div>
                        Unaffected
                    </div>
                </BaseLinkGroup>
            );

            expect(tree).toMatchSnapshot();
        });

        it('exclude list', () => {
            const tree = renderer.create(
                <BaseLinkGroup exclude={['exclude']}>
                    <div name="include">
                        Included
                    </div>
                    <div name="exclude">
                        Excluded
                    </div>
                    <div>
                        Unaffected
                    </div>
                </BaseLinkGroup>
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
