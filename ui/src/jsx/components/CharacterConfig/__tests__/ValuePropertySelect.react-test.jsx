import React from 'react';
import { mount } from 'enzyme';

import { ValuePropertySelect } from '../components/ValuePropertySelect';

const props = {
    type: 'value',
    uuid: 'mocked-uuid-1',
    path: 'some.path',
    value: "This shows _formatted_ content.",
};

describe('Component: ValuePropertySelect', () => {

    it('should not render anything when hidden', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <ValuePropertySelect
                onChange={onChange}
                {...props}
                hidden={true}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render the formatted description', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <ValuePropertySelect
                onChange={onChange}
                {...props}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
