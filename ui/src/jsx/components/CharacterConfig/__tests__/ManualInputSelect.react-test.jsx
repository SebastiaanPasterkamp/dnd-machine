import React from 'react';
import { mount } from 'enzyme';

import { ManualInputSelect } from '../components/ManualInputSelect';

const plainProps = {
    type: 'manual',
    uuid: 'mocked-uuid-1',
    path: 'some.path',
    placeholder: 'Hold this place',
    current: "This shows plain content.",
};

const mdProps = {
    type: 'manual',
    uuid: 'mocked-uuid-1',
    path: 'some.path',
    placeholder: 'Hold this place',
    current: "This shows _formatted_ content.",
    markup: true,
};

describe('Component: ManualInputSelect', () => {

    it('should render plain input', () => {
        const setState = jest.fn();
        const onChange = jest.fn();
        const wrapper = mount(
            <ManualInputSelect
                setState={setState}
                onChange={onChange}
                {...plainProps}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(setState).not.toBeCalled();
        expect(onChange).toBeCalledWith(plainProps.current);
    });

    it('should render markup input', () => {
        const setState = jest.fn();
        const onChange = jest.fn();
        const wrapper = mount(
            <ManualInputSelect
                setState={setState}
                onChange={onChange}
                {...mdProps}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(setState).not.toBeCalled();
        expect(onChange).toBeCalledWith(mdProps.current);
    });

    it('should emit changes when editing', () => {
        const setState = jest.fn();
        const onChange = jest.fn();
        const wrapper = mount(
            <ManualInputSelect
                setState={setState}
                onChange={onChange}
                {...plainProps}
            />
        );

        wrapper.find('input').simulate('change', {target: {value: "foo"}});

        expect(setState).toBeCalledWith({
            current: "foo",
        });
        expect(onChange).toBeCalledWith("foo");
    });
});
