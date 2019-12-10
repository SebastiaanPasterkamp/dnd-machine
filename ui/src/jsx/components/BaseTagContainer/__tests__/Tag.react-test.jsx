import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Tag from '../components/Tag';

describe('Component: Tag', () => {
    const fullProps = {
        label: 'Foo',
        description: 'Bar',
        disabled: true,
        className: 'custom class',
        color: 'red',
        badges: [
            {component: 'input', value: 'foo'},
            {component: 'input', type: 'checkbox', checked: true},
        ],
    };

    describe('rendering', () => {
        const onChange = jest.fn();
        const onDelete = jest.fn();

        it('works with minimum props', () => {
            const tree = renderer.create(
                <Tag />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });

        it('works with full props', () => {
            const tree = renderer.create(
                <Tag
                    {...fullProps}
                    onChange={onChange}
                    onDelete={onDelete}
                >
                    My Tag
                </Tag>
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });

        it('works with full props while not disabled', () => {
            const tree = renderer.create(
                <Tag
                    {...fullProps}
                    onChange={onChange}
                    onDelete={onDelete}
                    disabled={false}
                >
                    My Tag
                </Tag>
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });
    });
});
