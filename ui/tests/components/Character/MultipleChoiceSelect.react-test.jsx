import React from 'react';
import MultipleChoiceSelect from 'components/Character/MultipleChoiceSelect.jsx';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

const props = {
    index: [],
    label: 'Example',
    description: 'Pick some',
    options: [{
        label: 'Simple',
        path: 'foo.bar',
        type: 'dict',
        dict: {
            description: 'Bar is good',
        }
    }, {
        label: 'Complex',
        type: 'config',
        config: [{
            path: 'bar.foo',
            type: 'dict',
            dict: {
                description: 'Foo is okay',
            }
        }]
    }],
    getCurrent: jest.fn(
        path => path == 'bar.foo'
            ? { description: 'Foo is okay' }
            : null
    ),
    getItems: jest.fn(),
};

describe('Component: MultipleChoiceSelect', () => {
    it('should render with minimum props', () => {
        const onChange = jest.fn();
        const tree = renderer.create(
            <MultipleChoiceSelect
                {...props}
                onChange={onChange}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const onChange = jest.fn();
        const tree = renderer.create(
            <MultipleChoiceSelect
                {...props}
                onChange={onChange}
                limit={2}
                replace={1}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should emit onChange when updated and then unmounted', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <MultipleChoiceSelect
                {...props}
                getCurrent={() => {}}
                onChange={onChange}
                limit={1}
                />
        );

        expect(onChange).not.toBeCalled();

        wrapper
            .find('.nice-dropdown button')
            .simulate('click');
        wrapper
            .find('li[data-value="Simple"]')
            .simulate('click');

        expect(onChange).toBeCalledWith(
            "foo.bar",
            { description: 'Bar is good' },
            [0, 0],
            props.options[0]
        );

        onChange.mockClear();
        wrapper.unmount();

        expect(onChange).toBeCalledWith(
            "foo.bar",
            undefined,
            [0, 0],
            props.options[0]
        );
    });

    it('should handle replacing one existing', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <MultipleChoiceSelect
                onChange={onChange}
                {...props}
                replace={1}
                />
        );

        wrapper
            .find('.nice-tag-btn')
            .at(0)
            .simulate('click');

        expect(onChange).toBeCalledWith(
            'bar.foo',
            undefined,
            [0, 0, 0],
            props.options[1].config[0]
        );

        wrapper.setProps({
            getCurrent: jest.fn(() => null),
        });

        expect(wrapper).toMatchSnapshot('removed');

        onChange.mockClear();

        wrapper
            .find('.nice-dropdown button')
            .simulate('click');
        wrapper
            .find('li[data-value="Complex"]')
            .simulate('click');

        expect(wrapper).toMatchSnapshot('added back');

        expect(onChange).toBeCalledWith(
            "bar.foo",
            { description: 'Foo is okay' },
            [0, 0, 0],
            props.options[1].config[0]
        );
    });

    it('should handle removing a new pick', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <MultipleChoiceSelect
                onChange={onChange}
                {...props}
                limit={1}
                getCurrent={jest.fn(() => null)}
                />
        );

        onChange.mockClear();

        wrapper
            .find('.nice-dropdown button')
            .simulate('click');
        wrapper
            .find('li[data-value="Simple"]')
            .simulate('click');

        expect(wrapper).toMatchSnapshot('added');

        expect(onChange).toBeCalledWith(
            "foo.bar",
            { description: 'Bar is good' },
            [0, 0],
            props.options[0]
        );

        onChange.mockClear();

        wrapper
            .find('.nice-tag-btn')
            .at(0)
            .simulate('click');

        expect(onChange).toBeCalledWith(
            'foo.bar',
            undefined,
            [0, 0],
            props.options[0]
        );

        expect(wrapper).toMatchSnapshot('removed');
    });
});
