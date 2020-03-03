import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import TagContainer from '..';

const items = [
    { id: "a", name: "Aaa" },
    { id: "b", name: "Bbb", description: "Bee" },
];

describe('Component: TagContainer', () => {
    it('should render with minimal props', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <TagContainer
                setState={setState}
                value={[]}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with all props', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <TagContainer
                setState={setState}
                items={items}
                value={['a', 'b', 'a']}
                className="info"
                disabled={true}
                multiple={true}
                showSelect={false}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should exclude selected items from select in single mode', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <TagContainer
                setState={setState}
                items={items}
                value={['a']}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should allow all items in select in multiple mode', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <TagContainer
                setState={setState}
                items={items}
                value={['a']}
                multiple={true}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should emit changes when adding', () => {
        const setState = jest.fn();
        const onAdd = jest.fn();
        const wrapper = mount(
            <TagContainer
                setState={setState}
                onAdd={onAdd}
                items={items}
                value={['a']}
                multiple={true}
                />
        );

        wrapper
            .find('button.nice-btn')
            .simulate('click');
        wrapper
            .find('li[data-value="b"] a')
            .simulate('click');

        expect(setState)
            .toBeCalledWith(['a', 'b']);
        expect(onAdd)
            .toBeCalledWith('b');
    });

    it('should emit changes when deleting', () => {
        const setState = jest.fn();
        const onDelete = jest.fn();
        const wrapper = mount(
            <TagContainer
                setState={setState}
                onDelete={onDelete}
                items={items}
                value={['a', 'b']}
                />
        );

        wrapper
            .find('button.nice-tag-btn')
            .at(0)
            .simulate('click');

        expect(setState)
            .toBeCalledWith(['b']);
        expect(onDelete)
            .toBeCalledWith('a', 0);
    });
});
