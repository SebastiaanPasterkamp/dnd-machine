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

        input.simulate('change', { target: {value: '3x'} });
        expect(mock).toBeCalledWith(3);
        expect(wrapper.state('isFloat')).toBe(false);

        input.simulate('change', { target: {value: '3.'} });
        expect(mock).toBeCalledWith(3);
        expect(wrapper.state('isFloat')).toBe(true);

        input.simulate('change', { target: {value: '3.y'} });
        expect(mock).toBeCalledWith(3);
        expect(wrapper.state('isFloat')).toBe(false);

        input.simulate('change', { target: {value: '3.2'} });
        expect(mock).toBeCalledWith(3.2);
        expect(wrapper.state('isFloat')).toBe(false);

        input.simulate('change', { target: {value: '3.'} });
        expect(mock).toBeCalledWith(3);
        expect(wrapper.state('isFloat')).toBe(true);

        input.simulate('change', { target: {value: '3'} });
        expect(mock).toBeCalledWith(3);
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
});
