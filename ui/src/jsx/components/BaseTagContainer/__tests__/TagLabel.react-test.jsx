import React from 'react';
import renderer from 'react-test-renderer';

import TagLabel from '../components/TagLabel';

describe('Component: TagLabel', () => {
    it('works with minimum props', () => {
        const tree = renderer.create(
            <TagLabel />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('works with all props', () => {
        const tree = renderer.create(
            <TagLabel>
                Hello Tag
            </TagLabel>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
