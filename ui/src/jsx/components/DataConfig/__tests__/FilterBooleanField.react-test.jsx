import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import FilterBooleanField from '../components/FilterBooleanField';

describe('Component: FilterBooleanField', () => {
    const fullProps = {
        field: 'attrib',
        filter: true,
    };

    describe('when rendering', () => {
        const setState = jest.fn();

        it('should work with minimum props', () => {
            const tree = renderer.create(
                <FilterBooleanField
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <FilterBooleanField
                    {...fullProps}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })
    });

    it('should emit changes in the field', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <FilterBooleanField
                setState={setState}
            />
        );

        wrapper.find('input[type="text"]').simulate('change', {
            target: { value: fullProps.field }
        });

        expect(setState).toBeCalledWith({
            field: fullProps.field,
        });
    });

    it('should emit changes in the boolean', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <FilterBooleanField
                setState={setState}
            />
        );

        wrapper.find('.fa-angle-down').simulate('click');
        wrapper.find('li[data-value=true]').simulate('click');

        expect(setState).toBeCalledWith({
            filter: true,
        });
    });
});
