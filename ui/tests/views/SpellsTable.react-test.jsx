import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ListDataActions from 'actions/ListDataActions';
import {
    mockedApi,
    classes,
    magic_components,
    magic_schools,
} from '../__mocks__';

import SpellsTable from 'views/SpellsTable.jsx';

describe('SpellsTable', () => {
    const fullProps = {
        spells: {
            1: {
                casting_time: "1 action",
                classes: [ "Wizard" ],
                components: [ "material", "verbal", "somatic" ],
                concentration: false,
                cost: "Some leaf",
                description: "A green arrow doing `1d4`",
                duration: "Instantaneous",
                id: 1,
                level: "2",
                name: "Melf's Acid Arrow",
                range: "90 feet",
                school: "evocation",
            },
        },
    };

    beforeAll(() => {
        fetch.mockImplementation( mockedApi({
            'class': classes,
            magic_components,
            magic_schools,
            user: {},
            'spell/api': fullProps.spells,
        }) );
        ListDataActions.fetchItems('class', 'data');
        ListDataActions.fetchItems('magic_components');
        ListDataActions.fetchItems('magic_schools');
    })

    afterAll(() => {
        fetch.resetMocks()
    })

    describe('render', () => {
        it('should work without props', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/spell/list`}}>
                    <SpellsTable />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with all props', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/spell/list`}}>
                    <SpellsTable
                        {...fullProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });
    });

    describe('when searching', () => {
        let wrapper;

        beforeAll(() => {
            wrapper = mount(
                <MockRouter location={{pathname: `/items/spell/list`}}>
                    <SpellsTable
                        {...fullProps}
                    />
                </MockRouter>
            );
        });

        it('should match', () => {
            expect(wrapper
                .find('.spells-table .base-link-group')
                .length
            ).toBe(1);

            wrapper
                .find('input[placeholder="Name..."]')
                .simulate('change', {target: {value: 'arrow'}});
            wrapper
                .find('li[data-value="Wizard"] input')
                .simulate('change', {target: {checked: true}});
            wrapper
                .find('li[data-value="2"] input')
                .simulate('change', {target: {checked: true}});
            wrapper
                .find('li[data-value="3"] input')
                .simulate('change', {target: {checked: true}});

            expect(wrapper
                .find('.spells-table .base-link-group')
                .length
            ).toBe(1);
        });

        it('should filter', () => {
            expect(wrapper
                .find('.spells-table .base-link-group')
                .length
            ).toBe(1);

            wrapper
                .find('input[placeholder="Name..."]')
                .simulate('change', {target: {value: 'mace'}});

            expect(wrapper
                .find('.spells-table .base-link-group')
                .length
            ).toBe(0);
        });
    });
});
