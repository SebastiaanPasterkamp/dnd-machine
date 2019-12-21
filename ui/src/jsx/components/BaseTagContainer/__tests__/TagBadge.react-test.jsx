import React from 'react';
import renderer from 'react-test-renderer';

import TagBadge from '../components/TagBadge';

describe('Component: TagBadge', () => {
    it('works with minimum props', () => {
        const tree = renderer.create(
            <TagBadge />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('works without icon', () => {
        const tree = renderer.create(
            <TagBadge>
                Where's world?
            </TagBadge>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('works with all props', () => {
        const tree = renderer.create(
            <TagBadge icon="fa-eye">
                Hello world!
            </TagBadge>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
