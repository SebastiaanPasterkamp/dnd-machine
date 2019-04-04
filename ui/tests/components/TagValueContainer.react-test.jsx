import React from 'react';
import { mount } from 'enzyme';
import TagValueContainer from 'components/TagValueContainer.jsx';
import renderer from 'react-test-renderer';

const items = [
    { code: "a", label: "Aaa" },
    { name: "b", label: "Bbb", description: "Bee" },
];
const tagValues = [
    { code: 0, label: 'Zero' },
    { name: 5, label: 'Five' },
];

describe('Component: TagValueContainer', () => {
    it('should render with minimal props', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <TagValueContainer
                setState={setState}
                value={{}}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with all props', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <TagValueContainer
                setState={setState}
                items={items}
                tagValues={tagValues}
                value={{a: 5, b: 0}}
                className="info"
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render disabled', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <TagValueContainer
                setState={setState}
                items={items}
                tagValues={tagValues}
                value={{a: 5, b: 0}}
                disabled={true}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should exclude selected items from select in single mode', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <TagValueContainer
                setState={setState}
                items={items}
                value={{a: 5, b: 0}}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should emit changes when adding', () => {
        const setState = jest.fn();
        const onAdd = jest.fn();
        const wrapper = mount(
            <TagValueContainer
                setState={setState}
                onAdd={onAdd}
                items={items}
                value={{a: 5}}
                multiple={true}
                />
        );

        wrapper
            .find('button.nice-btn')
            .simulate('click');
        wrapper
            .find('li[data-value="b"] a')
            .simulate('click');

        expect(onAdd)
            .toBeCalledWith('b', 0);
        expect(setState)
            .toBeCalledWith({a: 5, b: 0});
    });

    it('should emit changes when changing by dropdown', () => {
        const setState = jest.fn();
        const onChange = jest.fn();
        const wrapper = mount(
            <TagValueContainer
                setState={setState}
                onChange={onChange}
                tagValues={tagValues}
                items={items}
                value={{a: 5}}
                />
        );

        wrapper
            .find('[data-value=0]')
            .simulate('click');

        expect(onChange)
            .toBeCalledWith('a', 0);
        expect(setState)
            .toBeCalledWith({a: 0});
    });

    it('should emit changes when changing input', () => {
        const setState = jest.fn();
        const onChange = jest.fn();
        const wrapper = mount(
            <TagValueContainer
                setState={setState}
                onChange={onChange}
                items={items}
                value={{a: 5, b: 0}}
                />
        );

        wrapper
            .find('input')
            .at(1)
            .simulate('change', { target: {value: 3} });

        expect(onChange)
            .toBeCalledWith('b', 3);
        expect(setState)
            .toBeCalledWith({a: 5, b: 3});
    });

    it('should emit changes when deleting', () => {
        const setState = jest.fn();
        const onDelete = jest.fn();
        const wrapper = mount(
            <TagValueContainer
                setState={setState}
                onDelete={onDelete}
                items={items}
                value={{a: 5, b: 0}}
                />
        );

        wrapper
            .find('button.nice-tag-btn')
            .at(0)
            .simulate('click');

        expect(onDelete)
            .toBeCalledWith('a');
        expect(setState)
            .toBeCalledWith({b: 0});
    });
});
