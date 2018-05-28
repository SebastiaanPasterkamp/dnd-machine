import React from 'react';
import { mount } from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';
import { stub } from 'sinon';
import MultiSelect from '../../src/jsx/components/MultiSelect.jsx';

describe('Component: MultiSelect', () => {
    it('should show a simple dropdown with 4 items', () => {
        const items = [
            {code: 1, label: 'One'},
            {code: 2, label: 'Two'},
            {code: 3, label: 'Three'},
            {code: 4, label: 'Four'},
        ];
        const tree = renderer.create(
            <MultiSelect items={items} selected={[]} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a dropdown with 4 items in various states', () => {
        const items = [
            {code: 1, label: 'One'},
            {code: 2, label: 'Two', disabled: true},
            {code: 3, label: 'Three', disabled: true},
            {code: 4, label: 'Four'},
        ];
        const tree = renderer.create(
            <MultiSelect items={items} selected={[3,4]} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a dropdown with 4 items disabled by callback', () => {
        const items = [
            {code: 1, label: 'One'},
            {code: 2, label: 'Two'},
            {code: 3, label: 'Three'},
            {code: 4, label: 'Four'},
        ];
        const tree = renderer.create(
            <MultiSelect
                items={items}
                selected={[3,4]}
                isDisabled={(item) => { return item.code%2 == 0; }}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should contain expected elements', () => {
        const items = [
            {code: 1, label: 'One', disabled: true},
            {code: 2, label: 'Two'},
            {code: 3, label: 'Three'},
            {code: 4, label: 'Four'},
        ];
        const wrapper = mount(
            <MultiSelect
                items={items}
                selected={[2,3]}
                />
        );

        expect(
            wrapper.find('button.nice-btn').exists()
        ).toBe(true);
        expect(
            wrapper.prop('selected')
        ).toEqual([2,3]);
        expect(
            wrapper.instance().getLabel()
        ).toEqual('2 selected');
        expect(
            wrapper.find('button.nice-btn').text()
        ).toEqual('2 selected');
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

    it('should not close on click', () => {
        const items = [
            {code: 1, label: 'One', disabled: true},
            {code: 2, label: 'Two'},
            {code: 3, label: 'Three'},
            {code: 4, label: 'Four'},
        ];
        const wrapper = mount(
            <MultiSelect items={items} selected={[]} />
        );

        expect(wrapper.find('ul.shown').exists()).toBe(false);

        wrapper.find('button').simulate('click');
        expect(wrapper.find('ul.shown').exists()).toBe(true);

        wrapper.find('li[data-value=1] input').simulate('change');
        wrapper.update();
        expect(wrapper.find('ul.shown').exists()).toBe(true);
    });

    it('should callback for disabled states', () => {
        const onIsDisabled = stub();
        const items = [
            {code: 1, label: 'One', disabled: true},
            {code: 2, label: 'Two'},
            {code: 3, label: 'Three'},
            {code: 4, label: 'Four'},
        ];
        const wrapper = mount(
            <MultiSelect
                items={items}
                selected={[]}
                isDisabled={onIsDisabled}
                />
        );

        expect(onIsDisabled.callCount).toEqual(4);
    });

    it('should callback the newly selected item', () => {
        const onClickCallback = stub();
        let selected = [3];
        onClickCallback.callsFake((state) => {
            selected = state;
        });
        const items = [
            {code: 1, label: 'One', disabled: true},
            {code: 2, label: 'Two'},
            {code: 3, label: 'Three'},
            {code: 4, label: 'Four'},
        ];
        const wrapper = mount(
            <MultiSelect
                items={items}
                selected={selected}
                setState={onClickCallback}
                />
        );

        wrapper.find('button').simulate('click');
        wrapper.find('li[data-value=2] input').simulate('change');
        expect(onClickCallback.callCount).toEqual(1);
        expect(selected).toBe(selected);
        expect(selected).toEqual(expect.arrayContaining([3, 2]));
    });

    it('should not callback for disabled item', () => {
        const onClickCallback = stub();
        const items = [
            {code: 1, label: 'One', disabled: true},
            {code: 2, label: 'Two'},
            {code: 3, label: 'Three'},
            {code: 4, label: 'Four'},
        ];
        const wrapper = mount(
            <MultiSelect
                items={items}
                selected={[3]}
                setState={onClickCallback}
                />
        );

        wrapper.find('button').simulate('click');
        wrapper.find('li[data-value=1] input').simulate('change');
        expect(onClickCallback.callCount).toEqual(0);
    });
});
