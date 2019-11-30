import React from 'react';
import { mount } from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';

import { BaseSelect } from '../BaseSelect';

describe('Component: BaseSelect', () => {
    it('should render without props', () => {
        const tree = renderer.create(
            <BaseSelect />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a simple dropdown with one button and item', () => {
        const props = {
            label: 'Click me'
        };
        const tree = renderer.create(
            <BaseSelect {...props}>
                <li>Example</li>
            </BaseSelect>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a dropdown with heading and description', () => {
        const props = {
            label: 'Click me',
            heading: 'Pick something',
            description: 'This is example text'
        };
        const tree = renderer.create(
            <BaseSelect {...props}>
                <li>Example</li>
            </BaseSelect>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should contain expected elements', () => {
        const props = {
            label: 'Click me'
        };
        const wrapper = mount(
            <BaseSelect {...props}>
                <li className="item">Example</li>
            </BaseSelect>
        );

        expect(
            wrapper.find('button.nice-btn').exists()
        ).toBe(true);
        expect(
            wrapper.find('button.nice-btn').text()
        ).toEqual(props.label);
        expect(
            wrapper.find('ul.dropdown-menu').exists()
        ).toBe(true);
        expect(
            wrapper.find('li.item').exists()
        ).toBe(true);
    });

    it('should close on click', () => {
        const props = {
            label: 'Click me'
        };
        const wrapper = mount(
            <BaseSelect {...props}>
                <li className="item">Example</li>
            </BaseSelect>
        );

        expect(wrapper.prop('closeOnClick')).toBe(true);

        expect(wrapper.state('shown')).toBe(false);
        expect(wrapper.find('ul.shown').exists()).toBe(false);

        wrapper.find('button').simulate('click');
        expect(wrapper.state('shown')).toBe(true);
        expect(wrapper.find('ul.shown').exists()).toBe(true);

        wrapper.find('li').simulate('click');
        expect(wrapper.state('shown')).toBe(false);
        expect(wrapper.find('ul.shown').exists()).toBe(false);
    });

    it('should not close on click', () => {
        const props = {
            label: 'Click me',
            closeOnClick: false
        };
        const wrapper = mount(
            <BaseSelect {...props}>
                <li className="item">Example</li>
            </BaseSelect>
        );

        expect(wrapper.prop('closeOnClick')).toBe(false);

        expect(wrapper.state('shown')).toBe(false);
        expect(wrapper.find('ul.shown').exists()).toBe(false);

        wrapper.find('button').simulate('click');
        expect(wrapper.state('shown')).toBe(true);
        expect(wrapper.find('ul.shown').exists()).toBe(true);

        wrapper.find('li').simulate('click');
        expect(wrapper.state('shown')).toBe(true);
        expect(wrapper.find('ul.shown').exists()).toBe(true);
    });

    it('should close on click outside', () => {
        const props = {
            label: 'Click me',
            closeOnClick: false
        };
        const wrapper = mount(
            <BaseSelect {...props}>
                <li className="item">Example</li>
            </BaseSelect>
        );

        expect(wrapper.state('shown')).toBe(false);
        expect(wrapper.find('ul.shown').exists()).toBe(false);

        wrapper.find('button').simulate('click');
        expect(wrapper.state('shown')).toBe(true);
        expect(wrapper.find('ul.shown').exists()).toBe(true);

        wrapper.instance().handleClickOutside();
        wrapper.update();
        expect(wrapper.state('shown')).toBe(false);
        expect(wrapper.find('ul.shown').exists()).toBe(false);
    });
});
