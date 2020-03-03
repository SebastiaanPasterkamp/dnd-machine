import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ListDataActions from 'actions/ListDataActions';
import {
    mockedApi,
    armor_types,
} from '../__mocks__';

import ArmorEdit from 'views/ArmorEdit.jsx';

describe('ArmorEdit', () => {
    const fullProps = {
        id: 1,
        type: 'medium',
        name: 'T-shirt',
        description: "Stronger than you thought",
        bonus: 2,
        requirements: {
            strength: 13,
        },
        weight: {
            lb: 0.3,
        },
        disadvantage: true,
        cost: {
            sp: 2,
        },
    };

    beforeAll(() => {
        fetch.mockImplementation( mockedApi({
            armor_types,
        }) );
        ListDataActions.fetchItems('armor_types', ['items', 'types']);
    })

    afterAll(() => {
        fetch.resetMocks()
    })

    describe('render', () => {
        it('should work without props', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/armor/new`}}>
                    <ArmorEdit />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with all props', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/armor/edit/${fullProps.id}`}}>
                    <ArmorEdit
                        {...fullProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });
    });

    describe('when editing the basics', () => {
        let wrapper;
        let setState = jest.fn();

        beforeAll(() => {
            wrapper = mount(
                <MockRouter location={{pathname: `/items/armor/new`}}>
                    <ArmorEdit setState={setState}/>
                </MockRouter>
            );
        });

        afterEach(() => setState.mockClear());

        it('can change the type', () => {
            const { type } = fullProps;
            wrapper
                .find(`li[data-value="${type}"]`)
                .simulate('click');
            expect(setState).toBeCalledWith({ type });
        });

        it('can change the name', () => {
            const { name } = fullProps;
            wrapper
                .find('input[placeholder="Name..."]')
                .simulate('change', {target: {value: name}});
            expect(setState).toBeCalledWith({ name });
        });

        it('can change the armor value', () => {
            const { bonus } = fullProps;
            wrapper
                .find('li[data-value="bonus"]')
                .simulate('click');
            wrapper
                .find('input[placeholder="Bonus..."]')
                .simulate('change', {target: {value: bonus}});
            expect(setState).toBeCalledWith({ bonus });
        });

        it('can switch the armor value', () => {
            const bonus = 0;
            const formula = "11 + statistics.modifiers.dexterity";
            wrapper
                .find('li[data-value="formula"]')
                .simulate('click');
            wrapper
                .find('input[placeholder="Formula..."]')
                .simulate('change', {target: {value: formula}});
            expect(setState).toBeCalledWith({ bonus: undefined, formula });
            wrapper
                .find('li[data-value="bonus"]')
                .simulate('click');
            expect(setState).toBeCalledWith({ bonus, formula: undefined });
        });
    });

    describe('when editing the properties', () => {
        let wrapper;
        let setState = jest.fn();

        beforeAll(() => {
            wrapper = mount(
                <MockRouter location={{pathname: `/items/armor/new`}}>
                    <ArmorEdit setState={setState}/>
                </MockRouter>
            );
        });

        afterEach(() => setState.mockClear());

        it('can set the stealth', () => {
            wrapper
                .find('li[data-value=true]')
                .simulate('click');
            expect(setState).toBeCalledWith({ disadvantage: true });
        });

        it('can set the weight', () => {
            const { weight } = fullProps;
            wrapper
                .find('input[placeholder="Pounds..."]')
                .simulate('change', {target: {value: weight.lb}});
            expect(setState).toBeCalledWith({ weight });
        });
    });
});
