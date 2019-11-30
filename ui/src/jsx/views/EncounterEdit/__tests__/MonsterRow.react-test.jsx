import React from 'react';
import { shallow, mount } from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import { mockedApi } from '../../../../../tests/__mocks__';

import MonsterRow from '../components/MonsterRow';

describe('View MonsterRow', () => {
    const meleeProps = {
        count: 2,
        monster: {
            id: 2,
            name: "Bear",
            challenge_rating_precise: 0.25,
            xp_rating: 10,
            hit_points: 7,
            armor_class: 12,
            average_damage: 3,
            attack_bonus: 2,
        },
    };
    const casterProps = {
        count: 1,
        monster: {
            id: 3,
            name: "Spider",
            challenge_rating_precise: 0.5,
            xp_rating: 25,
            hit_points: 15,
            armor_class: 14,
            average_damage: 7,
            spell_save_dc: 13,
        },
    };

    beforeAll(() => fetch.mockImplementation(mockedApi({
        current_user: {},
    })));

    afterAll(() => fetch.resetMocks());

    describe('rendering', () => {
        it('should work w/ minimum props', () => {
            const callback = jest.fn();

            const tree = renderer.create(
                <MockRouter>
                    <table>
                        <tbody>
                            <MonsterRow
                                onAddMonsterButton={callback}
                                onRemoveMonsterButton={callback}
                            />
                        </tbody>
                    </table>
                </MockRouter>
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('should work one monster', () => {
            const callback = jest.fn();

            const tree = renderer.create(
                <MockRouter>
                    <table>
                        <tbody>
                            <MonsterRow
                                {...casterProps}
                                onAddMonsterButton={callback}
                                onRemoveMonsterButton={callback}
                            />
                        </tbody>
                    </table>
                </MockRouter>
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('should work multiple monsters', () => {
            const callback = jest.fn();

            const tree = renderer.create(
                <MockRouter>
                    <table>
                        <tbody>
                            <MonsterRow
                                {...meleeProps}
                                onAddMonsterButton={callback}
                                onRemoveMonsterButton={callback}
                            />
                        </tbody>
                    </table>
                </MockRouter>
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('should get add/del callback per ID', () => {
            const callback = jest.fn();

            const tree = renderer.create(
                <MockRouter>
                    <table>
                        <tbody>
                            <MonsterRow
                                {...meleeProps}
                                onAddMonsterButton={callback}
                                onRemoveMonsterButton={callback}
                            />
                        </tbody>
                    </table>
                </MockRouter>
            );

            expect(callback).toBeCalledWith(meleeProps.monster.id);
        });
    });

    describe('when changing the encounter', () => {
        const onAdd = jest.fn();
        const onDel = jest.fn();
        let wrapped;

        beforeAll(() => {
            wrapped = mount(
                <MockRouter>
                    <table>
                        <tbody>
                            <MonsterRow
                                {...meleeProps}
                                onAddMonsterButton={() => onAdd}
                                onRemoveMonsterButton={() => onDel}
                            />
                        </tbody>
                    </table>
                </MockRouter>
           );
        });

        beforeEach(() => {
           onAdd.mockClear();
           onDel.mockClear();
        });

        it('should allow reducing the count', () => {
            wrapped
                .find('.fa-minus')
                .simulate('click');

            expect(onAdd).not.toBeCalled();
            expect(onDel).toBeCalledWith(
                expect.objectContaining({ type: "click" })
            );
        });

        it('should allow increasing the count', () => {
            wrapped
                .find('.fa-plus')
                .simulate('click');

            expect(onAdd).toBeCalledWith(
                expect.objectContaining({ type: "click" })
            );
            expect(onDel).not.toBeCalled();
       });
    });
});
