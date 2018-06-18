import React from 'react';
import ValuePropertySelect from 'components/Character/ValuePropertySelect.jsx';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

const value = "This shows _formatted_ content.";

describe('Component: ValuePropertySelect', () => {
    it('should not render anything', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <ValuePropertySelect
                path="some.path"
                onChange={onChange}
                value={value}
                hidden={true}
                />
        );

        expect(wrapper)
            .toMatchSnapshot('render');
    });

    it('should render the formatted description', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <ValuePropertySelect
                path="some.path"
                onChange={onChange}
                value={value}
                />
        );

        expect(wrapper)
            .toMatchSnapshot('render');
    });

    it('should emit onChange dispite being hidden', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <ValuePropertySelect
                path="some.path"
                onChange={onChange}
                value={value}
                hidden={true}
                />
        );

        expect(onChange)
            .toBeCalledWith('some.path', value);
    });

    it('should emit onChange on mount and umount', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <ValuePropertySelect
                path="some.path"
                onChange={onChange}
                value={value}
                />
        );

        expect(onChange)
            .toBeCalledWith('some.path', value);

        onChange.mockClear();
        wrapper.unmount();

        expect(onChange)
            .toBeCalledWith('some.path', undefined);
    });
});
