import React from 'react';
import { mount } from 'enzyme';

import { statistics } from '../../../../../tests/__mocks__';

import { ListPropertySelect } from '../components/ListPropertySelect';

const props = {
    type: 'list',
    uuid: 'mocked-uuid-1',
    path: 'some.path',
    list: ['statistics'],
    items: statistics,
    current: ['dexterity'],
}

describe('Component: ListPropertySelect', () => {

    it('should render with minimum props', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <ListPropertySelect
                setState={setState}
                type={props.type}
                uuid={props.uuid}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(setState).not.toBeCalled();
    });

    it('should not render select w/o items', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <ListPropertySelect
                setState={setState}
                {...props}
                items={undefined}
                add={1}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(setState).not.toBeCalled();
    });

    it('should not render select w/ filtering all items', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <ListPropertySelect
                setState={setState}
                {...props}
                add={1}
                filter={{ code: ['impossible'] }}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(setState).not.toBeCalled();
    });

    it('should not render when hidden', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <ListPropertySelect
                setState={setState}
                {...props}
                hidden={true}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(setState).not.toBeCalled();
    });

    it('should render with full props', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <ListPropertySelect
                setState={setState}
                {...props}
                given={[
                    'constitution',
                    'charisma',
                ]}
                add={2}
                replace={1}
                filter={{
                    code: [
                        'strength',
                        'charisma',
                        'intelligence',
                    ],
                    some_formula: 'blah blah',
                }}
                multiple={true}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(setState).not.toBeCalled();
    });

    it('should stil show unknown current values', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <ListPropertySelect
                setState={setState}
                {...props}
                given={[
                    'foo',
                ]}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should allow replacing one existing', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <ListPropertySelect
                setState={setState}
                {...props}
                given={[
                    'charisma',
                ]}
                filter={{ code: ['strength'] }}
                replace={1}
            />
        );

        wrapper.find('.fa-trash-o').at(0).simulate('click');
        expect(setState).toBeCalledWith({
            added: [],
            removed: ["dexterity"],
        });
        wrapper.setProps({
            added: [],
            removed: ["dexterity"],
        });

        wrapper.find('.nice-btn').simulate('click');
        wrapper.find('[data-value="strength"]').simulate('click');
        expect(setState).toBeCalledWith({
            added: ["strength"],
            removed: ["dexterity"],
        });
    });

    it('should handle adding and deleting new', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <ListPropertySelect
                setState={setState}
                {...props}
                given={[
                    'charisma',
                ]}
                add={1}
            />
        );

        wrapper.find('.nice-btn').simulate('click');
        wrapper.find('[data-value="strength"]').simulate('click');

        expect(setState).toBeCalledWith({
            added: ["strength"],
            removed: [],
        });
        wrapper.setProps({
            added: ["strength"],
        });

        wrapper.find('.nice-tag-btn').at(0).simulate('click');

        expect(setState).toBeCalledWith({
            added: [],
            removed: [],
        });
    });

    describe('should allow a limited number of tags', () => {
        let wrapper;

        beforeEach(() => {
            const setState = jest.fn();
            wrapper = mount(
                <ListPropertySelect
                    setState={setState}
                    {...props}
                    limit={2}
                />
            );
        });

        it('shows existing tab without delete button, and a select', () => {
            expect(wrapper.find('.nice-tag-label').length).toBe(1);
            expect(wrapper.find('.fa-trash-o').length).toBe(0);
            expect(wrapper.find('.nice-btn').length).toBe(1);
        });

        it('adding a new item adds a tag w/ delete button, but removes select', () => {
            wrapper.setProps({
                added: ["strength"],
                current: [...props.current, "strength"],
            });

            expect(wrapper.find('.nice-tag-label').length).toBe(2);
            expect(wrapper.find('.fa-trash-o').length).toBe(1);
            expect(wrapper.find('.nice-btn').length).toBe(0);
        });
    });
});
