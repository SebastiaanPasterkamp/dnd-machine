import React from 'react';
import AbilityScoreSelect from 'components/Character/AbilityScoreSelect.jsx';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

describe('Component: AbilityScoreSelect', () => {
    it('should not render anything', () => {
        const onChange = jest.fn();
        const tree = renderer.create(
            <AbilityScoreSelect
                onChange={onChange}
                limit={2}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should emit an Ability Score increase', () => {
        const onChange = jest.fn();
        const wrapper = shallow(
            <AbilityScoreSelect
                onChange={onChange}
                limit={2}
                />
        );

        expect(onChange)
            .toBeCalledWith(null, 2);
    });

    it('should revoke an Ability Score increase', () => {
        const onChange = jest.fn();
        const wrapper = shallow(
            <AbilityScoreSelect
                onChange={onChange}
                limit={2}
                />
        );

        onChange.mockClear();

        wrapper.unmount();

        expect(onChange)
            .toBeCalledWith(null, undefined);
    });
});
