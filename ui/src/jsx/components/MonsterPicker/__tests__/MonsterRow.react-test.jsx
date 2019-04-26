import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import MonsterRow from '../components/MonsterRow.jsx';

describe('MonsterRow', () => {
    const fullProps = {
        onPick: jest.fn(),
        item: {
            id: 1,
            name: "Beasty",
            challenge_rating: 1,
            xp: 50,
            size: "medium",
            type: "humanoid",
            alignment: 'true neutral',
        },
        currentPick: 1,
        label: "Choose",
        icon: "bullhorn",
    };

    describe('rendering', () => {
        it('should work with minimum props', () => {
            const tree = renderer.create(
                <MockRouter>
                    <MonsterRow
                        onPick={fullProps.onPick}
                        item={fullProps.item}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with full props', () => {
            const tree = renderer.create(
                <MockRouter>
                    <MonsterRow
                        {...fullProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });
    });

    it('should emit item.id onPick', () => {
        const wrapper = mount(
            <MockRouter>
                <MonsterRow
                    {...fullProps}
                />
            </MockRouter>
        );

        wrapper
            .find('.fa-bullhorn')
            .simulate('click');

        expect(fullProps.onPick)
            .toBeCalledWith(fullProps.item.id);
    });
});
