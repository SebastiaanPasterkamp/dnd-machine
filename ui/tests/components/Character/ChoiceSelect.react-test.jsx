import React from 'react';
import { mount } from 'enzyme';

import ChoiceSelect from 'components/Character/ChoiceSelect.jsx';

import actions from 'actions/CharacterEditorActions.jsx';
import store from 'stores/CharacterEditorStore.jsx';

const props = {
    type: 'choice',
    description: "One choice please",
    options: [{
        label: 'Choice A',
        type: 'ability_score',
        limit: 1,
    }, {
        label: 'Choice B',
        description: 'Some *text* here',
        type: 'ability_score',
        limit: 2,
    }],
};

describe('Component: ChoiceSelect', () => {

    afterEach(() => store.reset());

    it('should render with minimum props', () => {
        const wrapper = mount(
            <ChoiceSelect
                type="choice"
                options={[]}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();
    });

    it('should render with all props', () => {
        const wrapper = mount(
            <ChoiceSelect
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();
    });

    it('should emit changes while switching tabs', () => {
        const add = jest.spyOn(
            actions,
            'addChange'
        );
        const remove = jest.spyOn(
            actions,
            'removeChange'
        );
        const wrapper = mount(
            <ChoiceSelect
                {...props}
                />
        );

        wrapper
            .find('.tab-component__tab a')
            .at(1)
            .simulate('click');

        expect(remove)
            .toBeCalledWith('2-modifiers');

        remove.mockClear();

        wrapper
            .find('.tab-component__tab a')
            .at(0)
            .simulate('click');

        expect(remove)
            .toBeCalledWith('3-modifiers');

        expect(add)
            .not
            .toBeCalled();
    });
});
