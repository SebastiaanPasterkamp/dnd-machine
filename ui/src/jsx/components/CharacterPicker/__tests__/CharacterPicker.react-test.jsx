import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import CharacterPicker from '../CharacterPicker.jsx';

describe('CharacterPicker', () => {
    const fullProps = {
        onDone: jest.fn(),
        onFilter: jest.fn(c => c.user_id === 2),
        onCancel: jest.fn(),
        label: "Renamed dialog",
        characters: {
            1: {
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
            2: {
                id: 2,
                user_id: 1,
                race: 'Tiefling',
                class: 'Rogue',
                name: 'Stabby McStabface',
            },
            3: {
                id: 3,
                user_id: 2,
                race: 'Half-Orc',
                class: 'Druid',
                background: 'Sage',
                name: 'Beasty McBeastface',
                level: 2,
                gender: 'female',
                alignment: 'neutral good',
                xp: 900,
                xp_progress: 500,
                xp_level: 600,
            },
        },
    };

    describe('rendering', () => {
        it('should work with minimum props', () => {
            const tree = renderer.create(
                <MockRouter>
                    <CharacterPicker
                        onDone={fullProps.onDone}
                        onFilter={fullProps.onFilter}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with full props', () => {
            const tree = renderer.create(
                <MockRouter>
                    <CharacterPicker
                        {...fullProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });
    });

    describe('filtering', () => {
        const wrapper = mount(
            <MockRouter>
                <CharacterPicker
                    {...fullProps}
                />
            </MockRouter>
        );

        afterEach(() => jest.clearAllMocks());

        it('should use provided filter', () => {
            expect(wrapper.text())
                .toMatch(/Testy McTestface/);
            expect(wrapper.text())
                .not
                .toMatch(/Stabby McStabface/);
            expect(wrapper.text())
                .toMatch(/Beasty McBeastface/);
        });

        it('should use text filter', () => {
            wrapper
                .find('input')
                .simulate('change', {target: {value: 'beast'}});
            expect(wrapper.text())
                .not
                .toMatch(/Testy McTestface/);
            expect(wrapper.text())
                .not
                .toMatch(/Stabby McStabface/);
            expect(wrapper.text())
                .toMatch(/Beasty McBeastface/);
        });

        it('should use clear filter', () => {
            wrapper
                .find('input')
                .simulate('change', {target: {value: ''}});
            expect(wrapper.text())
                .toMatch(/Testy McTestface/);
            expect(wrapper.text())
                .not
                .toMatch(/Stabby McStabface/);
            expect(wrapper.text())
                .toMatch(/Beasty McBeastface/);
        });
    });

    describe('allows picking a Character', () => {
        const wrapper = mount(
            <MockRouter>
                <CharacterPicker
                    {...fullProps}
                />
            </MockRouter>
        );

        afterEach(() => jest.clearAllMocks());

        it('should remember the selected character', () => {
            expect(wrapper.exists('a.accent')).toBe(false);
            wrapper
                .find('.fa-user-secret')
                .at(0)
                .simulate('click');
            expect(wrapper.exists('a.accent')).toBe(true);
        });

        it('should emit the current selection', () => {
            wrapper
                .find('.fa-check')
                .simulate('click');

            expect(fullProps.onDone)
                .toBeCalledWith(fullProps.characters[1].id);
        });

        it('should allow canceling', () => {
            wrapper
                .find('.fa-cross')
                .simulate('click');

            expect(fullProps.onCancel)
                .toBeCalled();
            expect(fullProps.onDone)
                .not
                .toBeCalled();
        });
    });
});
