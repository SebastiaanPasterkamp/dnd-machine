import React from 'react';
import {shallow, mount} from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';
import { stub } from 'sinon';
import SingleSelect from '../../src/jsx/components/SingleSelect.jsx';

describe('Component: SingleSelect', () => {
    it('should show a simple dropdown with 3 items', () => {
        const items = [
            {code: 1, label: 'One'},
            {code: 2, label: 'Two'},
            {code: 3, label: 'Three'},
        ];
        const tree = renderer.create(
            <SingleSelect items={items} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a dropdown with 3 items in various states', () => {
        const items = [
            {code: 1, label: 'One'},
            {code: 2, label: 'Two', disabled: true},
            {code: 3, label: 'Three'},
        ];
        const tree = renderer.create(
            <SingleSelect items={items} selected={3} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a dropdown with 3 items disabled by callback', () => {
        const items = [
            {code: 1, label: 'One'},
            {code: 2, label: 'Two'},
            {code: 3, label: 'Three'},
        ];
        const tree = renderer.create(
            <SingleSelect
                items={items}
                selected={3}
                isDisabled={(item) => { return item.code != 2; }}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should contain expected elements', () => {
        const items = [
            {code: 1, label: 'One', disabled: true},
            {code: 2, label: 'Two'},
            {code: 3, label: 'Three'},
        ];
        const wrapper = mount(
            <SingleSelect
                items={items}
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
        const items = [
            {code: 1, label: 'One', disabled: true},
            {code: 2, label: 'Two'},
            {code: 3, label: 'Three'},
        ];
        const wrapper = mount(
            <SingleSelect items={items} />
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
        const items = [
            {code: 1, label: 'One', disabled: true},
            {code: 2, label: 'Two'},
            {code: 3, label: 'Three'},
        ];
        const wrapper = mount(
            <SingleSelect items={items} isDisabled={onIsDisabled} />
        );

        expect(onIsDisabled.callCount).toEqual(3);
    });

    it('should callback the newly selected item', () => {
        const onClickCallback = stub();
        const items = [
            {code: 1, label: 'One', disabled: true},
            {code: 2, label: 'Two'},
            {code: 3, label: 'Three'},
        ];
        const wrapper = mount(
            <SingleSelect items={items} setState={onClickCallback} />
        );

        wrapper.find('button').simulate('click');
        wrapper.find({'data-value': 2}).simulate('click');
        expect(onClickCallback.callCount).toEqual(1);
        expect(onClickCallback.calledWith(2)).toBe(true);
    });

    it('should not callback for disabled item', () => {
        const onClickCallback = stub();
        const items = [
            {code: 1, label: 'One', disabled: true},
            {code: 2, label: 'Two'},
            {code: 3, label: 'Three'},
        ];
        const wrapper = mount(
            <SingleSelect items={items} setState={onClickCallback} />
        );

        wrapper.find('button').simulate('click');
        wrapper.find({'data-value': 1}).simulate('click');
        expect(onClickCallback.callCount).toEqual(0);
    });
});
