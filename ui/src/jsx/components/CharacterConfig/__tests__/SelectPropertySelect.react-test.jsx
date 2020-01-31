import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import { statistics } from '../../../../../tests/__mocks__';

import { SelectPropertySelect } from '../components/SelectPropertySelect';

const props = {
    type: 'select',
    uuid: 'mocked-uuid-1',
    path: 'some.path',
    items: statistics,
    current: 'charisma',
}

describe('Component: SelectPropertySelect', () => {
    it('should not render anything', () => {
        const setState = jest.fn();
        const onChange = jest.fn();
        const wrapper = mount(
            <SelectPropertySelect
                setState={setState}
                onChange={onChange}
                {...props}
                hidden={true}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(setState).not.toBeCalled();
        expect(onChange).toBeCalledWith(props.current);
    });

    it('should render the list', () => {
        const setState = jest.fn();
        const onChange = jest.fn();
        const wrapper = mount(
            <SelectPropertySelect
                setState={setState}
                onChange={onChange}
                {...props}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should emit change on mount dispite being hidden', () => {
        const setState = jest.fn();
        const onChange = jest.fn();
        const wrapper = mount(
            <SelectPropertySelect
                setState={setState}
                onChange={onChange}
                {...props}
                hidden={true}
            />
        );

        expect(setState).not.toBeCalled();
        expect(onChange).toBeCalledWith(props.current);
    });

    it('should emit changes on new selection', () => {
        const setState = jest.fn();
        const onChange = jest.fn();
        const wrapper = mount(
            <SelectPropertySelect
                setState={setState}
                onChange={onChange}
                {...props}
                current={undefined}
            />
        );

        wrapper.find('button').simulate('click');
        wrapper.find({'data-value': 'wisdom'}).simulate('click');

        expect(setState).toBeCalledWith({
            current: "wisdom",
        });
        expect(onChange).toBeCalledWith("wisdom");
    });
});
