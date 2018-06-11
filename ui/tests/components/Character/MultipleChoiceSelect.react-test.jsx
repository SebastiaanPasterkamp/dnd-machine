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
        path => path == 'bar.foo',
    ),
    getItems: jest.fn(),
};

describe.skip('Component: MultipleChoiceSelect', () => {
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

    it('should omit unknown current values', () => {
        const onChange = jest.fn();
        const tree = renderer.create(
            <MultipleChoiceSelect
                onChange={onChange}
                {...props}
                given={[
                    'foo',
                ]}
                current={[
                    'bar',
                ]}
                />
        ).toJSON();

//         expect(tree).toMatchSnapshot();
    });

    it('should emit onChange when mounted / unmounted', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <MultipleChoiceSelect
                onChange={onChange}
                {...props}
                given={[
                    'strength',
                    'charisma',
                ]}
                current={[
                    'dexterity',
                ]}
                />
        );

        expect(onChange).toBeCalledWith(
            props.path,
            {
                "added": ["strength", "charisma"],
                "removed": [],
            }
        );

        onChange.mockClear();
        wrapper.unmount();

        expect(onChange).toBeCalledWith(
            props.path,
            undefined
        );
    });

    it('should handle replacing one existing', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <MultipleChoiceSelect
                onChange={onChange}
                {...props}
                given={[
                    'charisma',
                ]}
                current={[
                    'strength',
                ]}
                replace={1}
                />
        );

//         expect(wrapper).toMatchSnapshot('before');

        onChange.mockClear();
        wrapper
            .find('.nice-tag-btn')
            .at(0)
            .simulate('click');
        expect(onChange).toBeCalledWith(
            props.path,
            {
                "added": ["charisma"],
                "removed": ["strength"],
            }
        );

        onChange.mockClear();

        wrapper.setProps({
            current: ['charisma'],
        });

        expect(onChange).not.toBeCalled();

//         expect(wrapper).toMatchSnapshot('after');

        wrapper
            .find('.nice-btn')
            .simulate('click');
        wrapper
            .find('[data-value="strength"]')
            .simulate('click');

        expect(onChange).toBeCalledWith(
            props.path,
            {
                "added": ["charisma"],
                "removed": [],
            }
        );

        onChange.mockClear();

        wrapper.setProps({
            current: ['charisma', 'strength'],
        });

        expect(onChange).not.toBeCalled();

//         expect(wrapper).toMatchSnapshot('replaced');
    });

    it('should handle adding and deleting new', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <MultipleChoiceSelect
                onChange={onChange}
                {...props}
                given={[
                    'charisma',
                ]}
                current={[
                    'dexterity',
                ]}
                limit={1}
                />
        );

//         expect(wrapper).toMatchSnapshot('before');

        onChange.mockClear();
        wrapper
            .find('.nice-btn')
            .simulate('click');
        wrapper
            .find('[data-value="strength"]')
            .simulate('click');

        expect(onChange).toBeCalledWith(
            props.path,
            {
                "added": ["strength", "charisma"],
                "removed": [],
            }
        );

        onChange.mockClear();

        wrapper.setProps({
            current: ['charisma', 'dexterity', 'strength'],
        });

        expect(onChange).not.toBeCalled();

//         expect(wrapper).toMatchSnapshot('after');

        wrapper
            .find('.nice-tag-btn')
            .at(0)
            .simulate('click');
        expect(onChange).toBeCalledWith(
            props.path,
            {
                "added": ["charisma"],
                "removed": [],
            }
        );

        onChange.mockClear();

        wrapper.setProps({
            current: ['charisma', 'dexterity'],
        });

        expect(onChange).not.toBeCalled();

//         expect(wrapper).toMatchSnapshot('removed');
    });
});
