import React from 'react';
import renderer from 'react-test-renderer';

import TagButton from '../components/TagButton';

describe('Component: TagButton', () => {
    const onClick = jest.fn();

    const fullProps = {
        icon: 'fa-trash-o',
        label: 'Delete',
    };

    it('works with minimum props', () => {
        const tree = renderer.create(
            <TagButton onClick={onClick} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('works with all props', () => {
        const tree = renderer.create(
            <TagButton
                onClick={onClick}
                {...fullProps}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
