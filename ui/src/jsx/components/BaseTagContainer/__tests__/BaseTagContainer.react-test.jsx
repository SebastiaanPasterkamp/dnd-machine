import React from 'react';
import renderer from 'react-test-renderer';

import BaseTagContainer from '..';

describe('Component: BaseTagContainer', () => {
    it('works with minimum props', () => {
        const tree = renderer.create(
            <BaseTagContainer />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('works with all props', () => {
        const tree = renderer.create(
            <BaseTagContainer>
                Put tag stuff here
            </BaseTagContainer>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
