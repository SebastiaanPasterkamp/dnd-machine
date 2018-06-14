import React from 'react';
import ListPropertySelect from 'components/Character/ListPropertySelect.jsx';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

const { statistics } = require('../../__mocks__/apiCalls.js');

const props = {
    path: 'some.path',
    items: statistics,
}

describe('Component: ListPropertySelect', () => {
    it('should render with minimum props', () => {
        const onChange = jest.fn();
        const tree = renderer.create(
            <ListPropertySelect
                onChange={onChange}
                {...props}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should not render select w/o items', () => {
        const onChange = jest.fn();
        const tree = renderer.create(
            <ListPropertySelect
                onChange={onChange}
                {...props}
                limit={1}
                items={[]}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should not render select w/ filtering all items', () => {
        const onChange = jest.fn();
        const tree = renderer.create(
            <ListPropertySelect
                onChange={onChange}
                {...props}
                limit={1}
                filter={{ code: 'impossible' }}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should not render when hidden', () => {
        const onChange = jest.fn();
        const tree = renderer.create(
            <ListPropertySelect
                onChange={onChange}
                {...props}
                hidden={true}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const onChange = jest.fn();
        const tree = renderer.create(
            <ListPropertySelect
                onChange={onChange}
                {...props}
                given={[
                    'strength',
                    'charisma',
                ]}
                current={[
                    'dexterity',
                ]}
                limit={2}
                replace={1}
                filter={{
                    code: [
                        'strength',
                        'intelligence',
                    ],
                    some_formula: 'blah blah',
                }}
                multiple={true}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should omit unknown current values', () => {
        const onChange = jest.fn();
        const tree = renderer.create(
            <ListPropertySelect
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

        expect(tree).toMatchSnapshot();
    });

    it('should emit onChange when mounted / unmounted', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <ListPropertySelect
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
            <ListPropertySelect
                onChange={onChange}
                {...props}
                given={[
                    'charisma',
                ]}
                current={[
                    'strength',
                ]}
                filter={{ code: 'strength' }}
                replace={1}
                />
        );

        expect(wrapper).toMatchSnapshot('before');

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

        expect(wrapper).toMatchSnapshot('after');

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

        expect(wrapper).toMatchSnapshot('replaced');
    });

    it('should handle adding and deleting new', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <ListPropertySelect
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

        expect(wrapper).toMatchSnapshot('before');

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

        expect(wrapper).toMatchSnapshot('after');

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

        expect(wrapper).toMatchSnapshot('removed');
    });
});
