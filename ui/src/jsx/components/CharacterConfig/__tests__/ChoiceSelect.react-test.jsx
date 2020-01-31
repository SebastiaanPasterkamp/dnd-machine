import React from 'react';
import { mount } from 'enzyme';

import { mockedApi, statistics } from '../../../../../tests/__mocks__';

import { ChoiceSelect } from '../components/ChoiceSelect';

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
        const setState = jest.fn();
        const wrapper = mount(
            <ChoiceSelect
                setState={setState}
                {...fullProps}
                options={[]}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(setState).not.toBeCalled();
    });

    it('should render with all props', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <ChoiceSelect
                setState={setState}
                {...fullProps}
                selected="mocked-uuid-3"
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(setState).not.toBeCalled();
    });

    it('should emit the first tab if nothing is selected yet', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <ChoiceSelect
                setState={setState}
                {...fullProps}
                selected={undefined}
            />
        );

        expect(setState).toBeCalledWith({
            selected: fullProps.options[0].uuid,
        });
    });

    it('should emit changes while switching tabs', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <ChoiceSelect
                setState={setState}
                {...fullProps}
            />
        );

        wrapper
            .find('.tab-component__tab a')
            .at(1)
            .simulate('click');

        expect(setState).toBeCalledWith({
            selected: fullProps.options[1].uuid,
        });

        wrapper.setProps({
            selected: fullProps.options[1].uuid,
        });

        wrapper
            .find('.tab-component__tab a')
            .at(0)
            .simulate('click');

        expect(setState).toBeCalledWith({
            selected: fullProps.options[0].uuid,
        });
        wrapper.setProps({
            selected: fullProps.options[0].uuid,
        });
    });
});
