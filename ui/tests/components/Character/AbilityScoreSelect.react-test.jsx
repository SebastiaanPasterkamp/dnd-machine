import React from 'react';
import AbilityScoreSelect from 'components/Character/AbilityScoreSelect.jsx';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import actions from 'actions/CharacterEditorActions.jsx';
import store from 'stores/CharacterEditorStore.jsx';

describe('Component: AbilityScoreSelect', () => {

    afterEach(() => store.reset());

    it('should not render anything', () => {
        const tree = renderer.create(
            <AbilityScoreSelect
                limit={2}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should emit an Ability Score increase', () => {
        const add = jest.spyOn(
            actions,
            'addAbilityScoreIncrease'
        );
        const remove = jest.spyOn(
            actions,
            'removeAbilityScoreIncrease'
        );
        const wrapper = shallow(
            <AbilityScoreSelect
                limit={2}
                />
        );

        expect(add)
            .toBeCalledWith(2);
        expect(remove)
            .not
            .toBeCalled();
    });

    it('should revoke an Ability Score increase', () => {
        const remove = jest.spyOn(
            actions,
            'removeAbilityScoreIncrease'
        );
        const wrapper = shallow(
            <AbilityScoreSelect
                limit={2}
                />
        );

        wrapper.unmount();

        expect(remove)
            .toBeCalledWith(2);
    });
});
