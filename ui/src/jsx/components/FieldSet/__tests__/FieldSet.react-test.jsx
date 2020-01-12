import React from 'react';
import renderer from 'react-test-renderer';

import FieldSet from '..';

describe('Component: FieldSet', () => {
    it('should render', () => {
        const tree = renderer.create(
            <FieldSet label="test">
                Foo bar
            </FieldSet>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
