import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import DictFormulaField from '../components/DictFormulaField';

describe('Component: DictFormulaField', () => {
    const fullProps = {
        type: 'formula',
        field: 'attrib',
        formula: 'character.something',
        alttext: 'Something from the character',
    };

    describe('when rendering', () => {
        const setState = jest.fn();

        it('should work with minimum props', () => {
            const tree = renderer.create(
                <DictFormulaField
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <DictFormulaField
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
            <DictFormulaField
                setState={setState}
            />
        );

        wrapper.find('input[type="text"]').at(0).simulate('change', {
            target: { value: fullProps.field }
        });

        expect(setState).toBeCalledWith({
            type: 'formula',
            field: fullProps.field,
        });
    });

    it('should emit changes in the formula', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <DictFormulaField
                setState={setState}
            />
        );

        wrapper.find('input[type="text"]').at(1).simulate('change', {
            target: { value: fullProps.formula }
        });

        expect(setState).toBeCalledWith({
            type: 'formula',
            formula: fullProps.formula,
        });
    });

    it('should emit changes in the alt text', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <DictFormulaField
                setState={setState}
            />
        );

        wrapper.find('textarea').at(0).simulate('change', {
            target: { value: fullProps.alttext }
        });

        expect(setState).toBeCalledWith({
            type: 'formula',
            alttext: fullProps.alttext,
        });
    });
});
