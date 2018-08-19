import React from 'react';
import AbilityScoreSelect from 'components/Character/AbilityScoreSelect.jsx';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import CharacterEditorActions from 'actions/CharacterEditorActions.jsx';

describe('Component: AbilityScoreSelect', () => {

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
            CharacterEditorActions,
            'addAbilityScoreIncrease'
        );
        const remove = jest.spyOn(
            CharacterEditorActions,
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
            CharacterEditorActions,
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
