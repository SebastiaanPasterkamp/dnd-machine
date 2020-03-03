import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { SelectListComponent } from '..';
import InputField from '../../InputField';

describe('Component: SelectListComponent', () => {
    const fullProps = {
        list: [
            { type: 'b', value: 'Bar' },
        ],
        options: [
            {
                id: 'a',
                name: 'Input A',
                component: InputField,
                componentProps: {
                    placeholder: 'A...',
                },
                initialItem: {
                    value: 'default',
                },
            },
            {
                id: 'b',
                name: 'Input B',
                component: InputField,
                componentProps: {
                    placeholder: 'B...',
                },
            },
        ],
    };

    it('should render with minimum props', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <SelectListComponent
                list={[]}
                setState={setState}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('show some options', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <SelectListComponent
                list={[]}
                options={fullProps.options}
                setState={setState}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('show an item', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <SelectListComponent
                {...fullProps}
                setState={setState}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('allow deletion', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <SelectListComponent
                {...fullProps}
                setState={ setState }
            />
        );
        expect(setState).not.toBeCalled();

        wrapper
            .find('button.select-list-component__delete')
            .at(0)
            .simulate('click');

        expect(setState).toBeCalledWith([], null)
    });

    it('allow changes in components', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <SelectListComponent
                {...fullProps}
                setState={ setState }
            />
        );

        wrapper
            .find('input')
            .at(0)
            .simulate('change', {target: {value: 'food'}});

        expect(setState).toBeCalledWith(
            [ { type: 'b', value: 'food' } ],
            null
        );
    });

    it('allow adding components', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <SelectListComponent
                {...fullProps}
                setState={ setState }
            />
        );

        wrapper.find('div[name="add"] button').simulate('click');
        wrapper.find('li[data-value="a"]').simulate('click');

        expect(setState).toBeCalledWith(
            [
                { type: 'b', value: 'Bar' },
                { type: 'a', value: 'default' },
            ],
            null
        );
    });
});
