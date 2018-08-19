import React from 'react';
import { mount } from 'enzyme';

import ChoiceSelect from 'components/Character/ChoiceSelect.jsx';

import CharacterEditorActions from 'actions/CharacterEditorActions.jsx';

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
            CharacterEditorActions,
            'addAbilityScoreIncrease'
        );
        const remove = jest.spyOn(
            CharacterEditorActions,
            'removeAbilityScoreIncrease'
        );
        const wrapper = mount(
            <ChoiceSelect
                {...props}
                />
        );

        expect(add)
            .toBeCalledWith(1);

        add.mockClear();

        wrapper
            .find('.tab-component__tab a')
            .at(1)
            .simulate('click');

        expect(remove)
            .toBeCalledWith(1);
        expect(add)
            .toBeCalledWith(2);
    });
});
