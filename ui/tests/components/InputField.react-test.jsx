import React from 'react';
import { shallow } from 'enzyme';
import InputField from '../../src/jsx/components/InputField.jsx';
import renderer from 'react-test-renderer';

describe('Component: InputField', () => {
    it('should show a default InputField', () => {
        const tree = renderer.create(
            <InputField />
        );

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should show a disabled number field with class and placeholder', () => {
        const tree = renderer.create(
            <InputField
                value={3}
                type="number"
                disabled={true}
                placeholder="Fill in a number..."
                />
        );

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should allow for a trailing period on floats', () => {
        const mock = jest.fn();
        const wrapper = shallow(
            <InputField
                type="float"
                setState={mock}
                />
        );
        const input = wrapper.find('input');

        input.simulate('change', { target: {value: '3'} });
        expect(mock).toBeCalledWith(3);
        expect(wrapper.state('isFloat')).toBe(false);

        input.simulate('change', { target: {value: '4x'} });
        expect(mock).toBeCalledWith(3);
        expect(wrapper.state('isFloat')).toBe(false);

        input.simulate('change', { target: {value: '5.'} });
        expect(mock).toBeCalledWith(5);
        expect(wrapper.state('isFloat')).toBe(true);

        input.simulate('change', { target: {value: '6.y'} });
        expect(mock).toBeCalledWith(5);
        expect(wrapper.state('isFloat')).toBe(false);

        input.simulate('change', { target: {value: '7.2'} });
        expect(mock).toBeCalledWith(7.2);
        expect(wrapper.state('isFloat')).toBe(false);

        input.simulate('change', { target: {value: '8.'} });
        expect(mock).toBeCalledWith(8);
        expect(wrapper.state('isFloat')).toBe(true);

        input.simulate('change', { target: {value: '9'} });
        expect(mock).toBeCalledWith(9);
        expect(wrapper.state('isFloat')).toBe(false);

        input.simulate('change', { target: {value: ''} });
        expect(mock).toBeCalledWith(null);
        expect(wrapper.state('isFloat')).toBe(false);
    });

    it('should cast numbers to integers', () => {
        const mock = jest.fn();
        const wrapper = shallow(
            <InputField
                type="number"
                setState={mock}
                />
        );
        const input = wrapper.find('input');

        input.simulate('change', { target: {value: '3'} });
        expect(mock).toBeCalledWith(3);
        expect(wrapper.state('isFloat')).toBe(false);

        input.simulate('change', { target: {value: '3.'} });
        expect(mock).toBeCalledWith(3);
        expect(wrapper.state('isFloat')).toBe(false);

        input.simulate('change', { target: {value: '3.2'} });
        expect(mock).toBeCalledWith(3);
        expect(wrapper.state('isFloat')).toBe(false);

        input.simulate('change', { target: {value: ''} });
        expect(mock).toBeCalledWith(null);
        expect(wrapper.state('isFloat')).toBe(false);
    });

    it('should detect enter', () => {
        const mock = jest.fn();
        const wrapper = shallow(
            <InputField
                type="number"
                onEnter={mock}
                />
        );
        const input = wrapper.find('input');

        input.simulate('keyPress', { key: 'Enter' });
        expect(mock).toBeCalled();
    });

    it('should split and parse pasted values when handled', () => {
        const setState = jest.fn();
        const onPaste = jest.fn();
        const wrapper = shallow(
            <InputField
                type="number"
                setState={setState}
                onPaste={onPaste}
            />
        );

        wrapper.find('input').simulate('paste', {
            clipboardData: {
                getData: jest.fn().mockReturnValueOnce('1\n2\n3\n'),
            },
            preventDefault: jest.fn(),
        });

        expect(setState).not.toBeCalled();
        expect(onPaste).toBeCalledWith([1,2,3]);
    });
});
