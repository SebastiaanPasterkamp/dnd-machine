import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import DictNumberField from '../components/DictNumberField';

describe('Component: DictNumberField', () => {
    const fullProps = {
        type: 'number',
        field: 'attrib',
        number: 2,
    };

    describe('when rendering', () => {
        const setState = jest.fn();

        it('should work with minimum props', () => {
            const tree = renderer.create(
                <DictNumberField
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <DictNumberField
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
            <DictNumberField
                setState={setState}
            />
        );

        wrapper.find('input[type="text"]').simulate('change', {
            target: { value: fullProps.field }
        });

        expect(setState).toBeCalledWith({
            type: 'number',
            field: fullProps.field,
        });
    });

    it('should emit changes in the number', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <DictNumberField
                setState={setState}
            />
        );

        wrapper.find('input[type="number"]').simulate('change', {
            target: { value: fullProps.number }
        });

        expect(setState).toBeCalledWith({
            type: 'number',
            number: fullProps.number,
        });
    });
});
