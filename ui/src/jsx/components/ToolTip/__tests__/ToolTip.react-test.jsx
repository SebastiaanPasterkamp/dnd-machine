import React from 'react';
import renderer from 'react-test-renderer';

import ToolTip from '..';

describe('Component: ToolTip', () => {
    it('should not show a tooltip when not provided', () => {
        const tree = renderer.create(
            <ToolTip>
                Foo
            </ToolTip>
        ).toJSON()

        expect(tree).toMatchSnapshot();
    });

    it('should show a tooltip if provided', () => {
        const tree = renderer.create(
            <ToolTip content="Bar">
                Foo
            </ToolTip>
        ).toJSON()

        expect(tree).toMatchSnapshot();
    });
});
