import React from 'react';
import ChoiceSelect from 'components/Character/ChoiceSelect.jsx';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

const options = [{
    label: 'Choice A',
    type: 'ability_score',
    limit: 1,
}, {
    label: 'Choice B',
    description: 'Some *text* here',
    type: 'ability_score',
    limit: 2,
}];

describe('Component: ChoiceSelect', () => {
    it('should render with minimum props', () => {
        const onChange = jest.fn();
        const getCurrent = jest.fn();
        const getItems = jest.fn();
        const tree = renderer.create(
            <ChoiceSelect
                onChange={onChange}
                getCurrent={getCurrent}
                getItems={getItems}
                index={[]}
                options={[]}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with all props', () => {
        const onChange = jest.fn();
        const getCurrent = jest.fn();
        const getItems = jest.fn();
        const tree = renderer.create(
            <ChoiceSelect
                onChange={onChange}
                getCurrent={getCurrent}
                getItems={getItems}
                index={[1, 2]}
                description="One choice please"
                options={options}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should emit changes while switching tabs', () => {
        const onChange = jest.fn();
        const getCurrent = jest.fn();
        const getItems = jest.fn();
        const wrapper = mount(
            <ChoiceSelect
                onChange={onChange}
                getCurrent={getCurrent}
                getItems={getItems}
                index={[1, 2]}
                description="One choice please"
                options={options}
                />
        );

        expect(onChange)
            .toBeCalledWith(
                null,
                1,
                [1, 2, 0, 0],
                options[0]
                );

        onChange.mockClear();

        wrapper
            .find('.tab-component__tab a')
            .at(1)
            .simulate('click');

        expect(onChange.mock.calls)
            .toMatchSnapshot('unount tab 0, mount tab 1');
    });
});
