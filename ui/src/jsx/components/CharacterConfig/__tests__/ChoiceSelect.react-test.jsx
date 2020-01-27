import React from 'react';
import { mount } from 'enzyme';

import { mockedApi, statistics } from '../../../../../tests/__mocks__';

import { ChoiceSelect } from '..';

describe('Component: ChoiceSelect', () => {
    const fullProps = {
        type: 'choice',
        uuid: 'mocked-uuid-1',
        selected: 'mocked-uuid-2',
        options: [{
            type: 'ability_score',
            uuid: 'mocked-uuid-2',
            label: 'Choice A',
            limit: 1,
        }, {
            type: 'ability_score',
            uuid: 'mocked-uuid-3',
            label: 'Choice B',
            description: 'Some *text* here',
            limit: 2,
        }],
    };

    beforeAll(() => {
        fetch.mockImplementation( mockedApi({
            statistics,
        }) );
    });

    afterAll(() => fetch.resetMocks());

    it('should render with minimum props', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <ChoiceSelect
                onChange={onChange}
                {...fullProps}
                options={[]}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(onChange).not.toBeCalled();
    });

    it('should render with all props', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <ChoiceSelect
                onChange={onChange}
                {...fullProps}
                selected="mocked-uuid-3"
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(onChange).not.toBeCalled();
    });

    it('should emit the first tab if nothing is selected yet', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <ChoiceSelect
                onChange={onChange}
                {...fullProps}
                selected={undefined}
            />
        );

        expect(onChange).toBeCalledWith({
            uuid: fullProps.uuid,
            selected: fullProps.options[0].uuid,
        });
    });

    it('should emit changes while switching tabs', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <ChoiceSelect
                onChange={onChange}
                {...fullProps}
            />
        );

        wrapper
            .find('.tab-component__tab a')
            .at(1)
            .simulate('click');

        expect(onChange).toBeCalledWith({
            uuid: fullProps.uuid,
            selected: fullProps.options[1].uuid,
        });

        wrapper.setProps({
            selected: fullProps.options[1].uuid,
        });

        wrapper
            .find('.tab-component__tab a')
            .at(0)
            .simulate('click');

        expect(onChange).toBeCalledWith({
            uuid: fullProps.uuid,
            selected: fullProps.options[0].uuid,
        });
        wrapper.setProps({
            selected: fullProps.options[0].uuid,
        });
    });
});
