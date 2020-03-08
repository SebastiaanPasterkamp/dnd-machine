import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import FilterFormulaField from '../components/FilterFormulaField';

describe('Component: FilterFormulaField', () => {
    const fullProps = {
        type: "formula",
        field: 'attrib',
        options: '2 * some.value',
    };

    describe('when rendering', () => {
        const setState = jest.fn();

        it('should work with minimum props', () => {
            const tree = renderer.create(
                <FilterFormulaField
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <FilterFormulaField
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
            <FilterFormulaField
                setState={setState}
            />
        );

        wrapper.find('input[type="text"]').at(0).simulate('change', {
            target: { value: fullProps.field }
        });

        expect(setState).toBeCalledWith({
            type: fullProps.type,
            field: fullProps.field + '_formula',
        });
    });

    it('should emit changes in the formula', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <FilterFormulaField
                setState={setState}
            />
        );

        wrapper.find('input[type="text"]').at(1).simulate('change', {
            target: { value: fullProps.options }
        });

        expect(setState).toBeCalledWith({
            type: fullProps.type,
            options: fullProps.options,
        });
    });
});
