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
        type: 'new',
    },
};

describe('Component: DictPropertySelect', () => {

    it('should not render anything while hidden', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <DictPropertySelect
                setState={setState}
                {...props}
                hidden={true}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render the updated description', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <DictPropertySelect
                setState={setState}
                {...props}
                current={{...props.current, ...props.dict}}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should emit setState dispite being hidden', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <DictPropertySelect
                setState={setState}
                {...props}
                hidden={true}
            />
        );

        expect(setState).not.toBeCalled();
    });
});
