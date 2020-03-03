import React from 'react';
import { mount } from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';
import { stub } from 'sinon';

import SingleSelect from '../SingleSelect';

const props = {
    items: [
        {id: 1, name: 'One'},
        {id: 2, name: 'Two'},
        {id: 3, name: 'Three'},
    ],
};

const disabled = {
    items: [
        {id: 1, name: 'One', disabled: true},
        {id: 2, name: 'Two'},
        {id: 3, name: 'Three'},
    ],
};

describe('Component: SingleSelect', () => {
    it('should show a simple dropdown with 3 items', () => {
        const tree = renderer.create(
            <SingleSelect
                {...props}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a dropdown with 3 items in various states', () => {
        const tree = renderer.create(
            <SingleSelect
                {...disabled}
                selected={3}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a dropdown with 3 items disabled by callback', () => {
        const tree = renderer.create(
            <SingleSelect
                {...props}
                selected={3}
                isDisabled={(item) => { return item.id != 2; }}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should handle unknown value', () => {
        const tree = renderer.create(
            <SingleSelect
                {...props}
                selected={4}
            />
        );

        expect(tree)
            .toMatchSnapshot();
    });

    it('should contain expected elements', () => {
        const wrapper = mount(
            <SingleSelect
                {...disabled}
                selected={2}
            />
        );

        expect(
            wrapper.find('button.nice-btn').exists()
        ).toBe(true);
        expect(
            wrapper.find('button.nice-btn').text()
        ).toEqual('Two');
        expect(
            wrapper.find('ul.dropdown-menu').exists()
        ).toBe(true);
        expect(
            wrapper.find('li.info').exists()
        ).toBe(true);
        expect(
            wrapper.find('li.disabled').exists()
        ).toBe(true);
    });

    it('should close on click', () => {
        const wrapper = mount(
            <SingleSelect
                {...disabled}
            />
        );

        expect(wrapper.find('ul.shown').exists()).toBe(false);

        wrapper.find('button').simulate('click');
        expect(wrapper.find('ul.shown').exists()).toBe(true);

        wrapper.find({'data-value': 1}).simulate('click');
        wrapper.update();
        expect(wrapper.find('ul.shown').exists()).toBe(false);
    });

    it('should callback for disabled states', () => {
        const onIsDisabled = stub();
        const wrapper = mount(
            <SingleSelect
                {...disabled}
                isDisabled={onIsDisabled}
            />
        );

        expect(onIsDisabled.callCount).toEqual(3);
    });

    it('should callback the newly selected item', () => {
        const onClickCallback = stub();
        const wrapper = mount(
            <SingleSelect
                {...disabled}
                setState={onClickCallback}
            />
        );

        wrapper.find('button').simulate('click');
        wrapper.find({'data-value': 2}).simulate('click');
        expect(onClickCallback.callCount).toEqual(1);
        expect(onClickCallback.calledWith(2)).toBe(true);
    });

    it('should not callback for disabled item', () => {
        const onClickCallback = stub();
        const wrapper = mount(
            <SingleSelect
                {...disabled}
                setState={onClickCallback}
            />
        );

        wrapper.find('button').simulate('click');
        wrapper.find({'data-value': 1}).simulate('click');
        expect(onClickCallback.callCount).toEqual(0);
    });
});
