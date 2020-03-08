import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import FilterTextField from '../components/FilterTextField';

describe('Component: FilterTextField', () => {
    const fullProps = {
        type: 'textfield',
        field: 'attrib',
        options: ['foo', 'bar']
    };

    describe('when rendering', () => {
        const setState = jest.fn();

        it('should work with minimum props', () => {
            const tree = renderer.create(
                <FilterTextField
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <FilterTextField
                    {...fullProps}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })
    });

    describe('when editing', () => {
        it('should emit changes in the field', () => {
            const setState = jest.fn();

            const wrapper = mount(
                <FilterTextField
                    setState={setState}
                />
            );

            wrapper.find('input[type="text"]').at(0).simulate('change', {
                target: { value: fullProps.field }
            });

            expect(setState).toBeCalledWith({
                type: fullProps.type,
                field: fullProps.field,
            });
        });

        it('should emit changes in the values', () => {
            const setState = jest.fn();

            const wrapper = mount(
                <FilterTextField
                    {...fullProps}
                    setState={setState}
                />
            );

            wrapper.find('input').at(1).simulate('change', {
                target: { value: 'FOO' }
            });

            expect(setState).toBeCalledWith({
                type: fullProps.type,
                options: ['FOO', 'bar']
            });
        });

        it('should add new values', () => {
            const setState = jest.fn();

            const wrapper = mount(
                <FilterTextField
                    {...fullProps}
                    setState={setState}
                />
            );

            wrapper.find('input').at(3).simulate('change', {
                target: { value: 'ruh' }
            });

            expect(setState).toBeCalledWith({
                type: fullProps.type,
                options: ['foo', 'bar', 'ruh']
            });
        });

        it('should remove existing values', () => {
            const setState = jest.fn();

            const wrapper = mount(
                <FilterTextField
                    {...fullProps}
                    setState={setState}
                />
            );

            wrapper.find('button[name="del"]').at(0).simulate('click');

            expect(setState).toBeCalledWith({
                type: fullProps.type,
                options: ['bar']
            });
        });
    });
});
