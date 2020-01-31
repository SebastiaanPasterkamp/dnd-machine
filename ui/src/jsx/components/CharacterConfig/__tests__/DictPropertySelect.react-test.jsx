import React from 'react';
import { mount } from 'enzyme';

import { DictPropertySelect } from '../components/DictPropertySelect';

const props = {
    type: 'dict',
    uuid: 'mocked-uuid-1',
    path: 'some.path',
    dict: {
        type: 'new',
    },
    current: {
        description: 'This shows _%(type)s_ content',
        type: 'old',
    },
};

describe('Component: DictPropertySelect', () => {

    it('should not render anything while hidden', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <DictPropertySelect
                onChange={onChange}
                {...props}
                hidden={true}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render the updated description', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <DictPropertySelect
                onChange={onChange}
                {...props}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should emit onChange dispite being hidden', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <DictPropertySelect
                onChange={onChange}
                {...props}
                hidden={true}
            />
        );

        expect(onChange).toBeCalledWith(props.dict);
    });
});
