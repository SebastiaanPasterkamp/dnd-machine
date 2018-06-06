import React from 'react';
import DictPropertySelect from 'components/Character/DictPropertySelect.jsx';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

const current = {
    description: 'This shows _%(type)s_ content',
    type: 'old',
};
const dict = {
    type: 'new',
};

describe('Component: DictPropertySelect', () => {
    it('should not render anything', () => {
        const onChange = jest.fn();
        const wrapper = shallow(
            <DictPropertySelect
                path="some.path"
                onChange={onChange}
                current={current}
                dict={dict}
                hidden={true}
                />
        );

        expect(wrapper)
            .toMatchSnapshot('render');
    });

    it('should emit onChange dispite being hidden', () => {
        const onChange = jest.fn();
        const wrapper = shallow(
            <DictPropertySelect
                path="some.path"
                onChange={onChange}
                current={current}
                dict={dict}
                hidden={true}
                />
        );

        expect(onChange)
            .toBeCalledWith('some.path', dict);
    });

    it('should render the updated description', () => {
        const onChange = jest.fn();
        const wrapper = shallow(
            <DictPropertySelect
                path="some.path"
                onChange={onChange}
                current={current}
                dict={dict}
                />
        );

        expect(wrapper)
            .toMatchSnapshot('render');
    });

    it('should emit onChange on mount and umount', () => {
        const onChange = jest.fn();
        const wrapper = shallow(
            <DictPropertySelect
                path="some.path"
                onChange={onChange}
                current={current}
                dict={dict}
                />
        );

        expect(onChange)
            .toBeCalledWith('some.path', dict);

        onChange.mockClear();
        wrapper.unmount();

        expect(onChange)
            .toBeCalledWith('some.path', undefined);
    });
});
