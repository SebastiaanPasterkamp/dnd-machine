import React from 'react';
import { mount } from 'enzyme';
import CalculatorInputField from 'components/CalculatorInputField.jsx';
import renderer from 'react-test-renderer';

describe('Component: CalculatorInputField', () => {
    it('should render without props', () => {
        const tree = renderer.create(
            <CalculatorInputField
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a simple numeric value', () => {
        const tree = renderer.create(
            <CalculatorInputField
                value={10}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a text based formula', () => {
        const tree = renderer.create(
            <CalculatorInputField
                value={"5 + 5"}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should emit new value simple value', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <CalculatorInputField
                setState={ setState }
                />
        );

        wrapper
            .find('input')
            .simulate('change', {target: {value: '10'}});

        expect(setState).toBeCalledWith(10, '10');
    });

    it('should emit 0 for empty value', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <CalculatorInputField
                setState={ setState }
                />
        );

        wrapper
            .find('input')
            .simulate('change', {target: {value: ''}});

        expect(setState).toBeCalledWith(0, '');
    });

    it('should emit nothing for invalid input', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <CalculatorInputField
                setState={ setState }
                />
        );

        wrapper
            .find('input')
            .simulate('change', {target: {value: 'bad'}});

        expect(setState).not.toBeCalled();
    });

    it('should emit final value from formula', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <CalculatorInputField
                setState={ setState }
                />
        );

        wrapper
            .find('input')
            .simulate('change', {target: {value: '20 - 10'}});

        expect(setState).toBeCalledWith(10, '20 - 10');
    });

    it('should hold changes until the formula is valid', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <CalculatorInputField
                setState={ setState }
                />
        );

        wrapper
            .find('input')
            .simulate('change', {target: {value: '-20 + '}});

        expect(setState).not.toBeCalled();

        wrapper
            .find('input')
            .simulate('change', {target: {value: '-20 + 30'}});

        expect(setState).toBeCalledWith(10, '-20 + 30');
    });
});
