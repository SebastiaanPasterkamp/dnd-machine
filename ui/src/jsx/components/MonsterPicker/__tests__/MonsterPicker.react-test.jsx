import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import MonsterPicker from '../MonsterPicker.jsx';

describe('MonsterPicker', () => {
    const fullProps = {
        onDone: jest.fn(),
        onFilter: jest.fn(c => c.alignment !== "true neutral"),
        onCancel: jest.fn(),
        label: "Renamed dialog",
        monsters: {
            1: {
                id: 1,
                name: "Onsy",
                challenge_rating: 1,
                xp: 50,
                size: "small",
                type: "humanoid",
                alignment: 'lawful neutral',
            },
            2: {
                id: 2,
                name: "Twosy",
                challenge_rating: 2,
                xp: 50,
                size: "medium",
                type: "humanoid",
                alignment: 'true neutral',
            },
            3: {
                id: 3,
                name: "Threesy",
                challenge_rating: 3,
                xp: 50,
                size: "large",
                type: "humanoid",
                alignment: 'chaotic neutral',
            },
        },
    };

    describe('rendering', () => {
        it('should work with minimum props', () => {
            const tree = renderer.create(
                <MockRouter>
                    <MonsterPicker
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
                    <MonsterPicker
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
                <MonsterPicker
                    {...fullProps}
                />
            </MockRouter>
        );

        afterEach(() => jest.clearAllMocks());

        it('should use provided filter', () => {
            expect(wrapper.text())
                .toMatch(/Onsy/);
            expect(wrapper.text())
                .not
                .toMatch(/Twosy/);
            expect(wrapper.text())
                .toMatch(/Threesy/);
        });

        it('should use text filter', () => {
            wrapper
                .find('input')
                .simulate('change', {target: {value: 'three'}});
            expect(wrapper.text())
                .not
                .toMatch(/Onsy/);
            expect(wrapper.text())
                .not
                .toMatch(/Twosy/);
            expect(wrapper.text())
                .toMatch(/Threesy/);
        });

        it('should use clear filter', () => {
            wrapper
                .find('input')
                .simulate('change', {target: {value: ''}});
            expect(wrapper.text())
                .toMatch(/Onsy/);
            expect(wrapper.text())
                .not
                .toMatch(/Twosy/);
            expect(wrapper.text())
                .toMatch(/Threesy/);
        });
    });

    describe('allows picking a Monster', () => {
        const wrapper = mount(
            <MockRouter>
                <MonsterPicker
                    {...fullProps}
                />
            </MockRouter>
        );

        afterEach(() => jest.clearAllMocks());

        it('should remember the selected monster', () => {
            expect(wrapper.exists('a.accent')).toBe(false);
            wrapper
                .find('.fa-paw')
                .at(0)
                .simulate('click');
            expect(wrapper.exists('a.accent')).toBe(true);
        });

        it('should emit the current selection', () => {
            wrapper
                .find('.fa-check')
                .simulate('click');

            expect(fullProps.onDone)
                .toBeCalledWith(fullProps.monsters[1].id);
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
