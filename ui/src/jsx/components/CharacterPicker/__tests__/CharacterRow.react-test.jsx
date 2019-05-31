import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import {
    mockedApi,
    alignments,
    genders,
} from '../../../../../tests/__mocks__';

import CharacterRow from '../components/CharacterRow.jsx';

describe('CharacterRow', () => {
    const fullProps = {
        onPick: jest.fn(),
        item: {
            id: 1,
            user_id: 2,
            race: 'Human',
            class: 'Fighter',
            background: 'Soldier',
            name: 'Testy McTestface',
            level: 1,
            gender: 'male',
            alignment: 'true neutral',
            adventure_checkpoints: 3,
            acp_progress: 3,
            acp_level: 4,
        },
        currentPick: 1,
        label: "Choose",
        icon: "user",
    };

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
            alignments: [
                alignments[1],
                alignments[9],
            ],
            genders,
            user: {
                name: "User",
            },
        }) );
    })

    afterEach(() => {
        fetch.resetMocks();
    })

    describe('rendering', () => {
        it('should work with minimum props', () => {
            const tree = renderer.create(
                <MockRouter>
                    <CharacterRow
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
                    <CharacterRow
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
                <CharacterRow
                    {...fullProps}
                />
            </MockRouter>
        );

        wrapper
            .find('.fa-user')
            .simulate('click');

        expect(fullProps.onPick)
            .toBeCalledWith(fullProps.item.id);
    });
});
