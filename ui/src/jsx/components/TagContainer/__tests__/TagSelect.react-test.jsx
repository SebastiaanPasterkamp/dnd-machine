import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import TagSelect from '../components/TagSelect';

describe('Component: TagSelect', () => {
    const fullProps = {
        items: [
            { id: 1, label: 'one' },
            { code: 2, name: 'Two' },
            { name: 'three' },
        ],
        current: [ 2 ],
        multiple: true,
    };

    describe('rendering', () => {
        const onSelect = jest.fn();

        it('works with minimum props', () => {
            const tree = renderer.create(
                <TagSelect onSelect={onSelect} />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });

        it('works with only items', () => {
            const tree = renderer.create(
                <TagSelect
                    onSelect={onSelect}
                    items={fullProps.items}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });

        it('works with some selected', () => {
            const tree = renderer.create(
                <TagSelect
                    onSelect={onSelect}
                    items={fullProps.items}
                    current={fullProps.current}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });

        it('works with some selected, but allowing multiple', () => {
            const tree = renderer.create(
                <TagSelect
                    onSelect={onSelect}
                    {...fullProps}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });
    });
});
