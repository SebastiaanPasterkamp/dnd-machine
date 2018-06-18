import React from 'react';
import SelectPropertySelect from 'components/Character/SelectPropertySelect.jsx';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

const { statistics } = require('../../__mocks__/apiCalls.js');

const props = {
    path: 'some.path',
    items: statistics,
    current: 'strength',
}

describe('Component: SelectPropertySelect', () => {
    it('should not render anything', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <SelectPropertySelect
                onChange={onChange}
                hidden={true}
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();
    });

    it('should render the list', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <SelectPropertySelect
                onChange={onChange}
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();
    });

    it('should emit onChange dispite being hidden', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <SelectPropertySelect
                onChange={onChange}
                hidden={true}
                {...props}
                />
        );

        expect(onChange)
            .toBeCalledWith('some.path', props.current);
    });

    it('should emit onChange on new selection', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <SelectPropertySelect
                onChange={onChange}
                {...props}
                />
        );

        onChange.mockClear();

        wrapper
            .find('button')
            .simulate('click');
        wrapper
            .find({'data-value': 'wisdom'})
            .simulate('click');

        expect(onChange)
            .toBeCalledWith('some.path', 'wisdom');
    });

    it('should emit onChange on mount and umount', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <SelectPropertySelect
                onChange={onChange}
                {...props}
                />
        );

        expect(onChange)
            .toBeCalledWith('some.path', props.current);

        onChange.mockClear();
        wrapper.unmount();

        expect(onChange)
            .toBeCalledWith('some.path', undefined);
    });
});
