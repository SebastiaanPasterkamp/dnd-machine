import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import DictTextField from '../components/DictTextField';

describe('Component: DictTextField', () => {
    const fullProps = {
        type: 'text',
        field: 'attrib',
        text: 'Foo Bar',
    };

    describe('when rendering', () => {
        const setState = jest.fn();

        it('should work with minimum props', () => {
            const tree = renderer.create(
                <DictTextField
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <DictTextField
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
            <DictTextField
                setState={setState}
            />
        );

        wrapper.find('input[type="text"]').simulate('change', {
            target: { value: fullProps.field }
        });

        expect(setState).toBeCalledWith({
            type: 'text',
            field: fullProps.field,
        });
    });

    it('should emit changes in the text', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <DictTextField
                setState={setState}
            />
        );

        wrapper.find('textarea').simulate('change', {
            target: { value: fullProps.text }
        });

        expect(setState).toBeCalledWith({
            type: 'text',
            text: fullProps.text,
        });
    });
});
