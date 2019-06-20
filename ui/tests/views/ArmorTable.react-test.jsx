import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import {
    mockedApi,
    armor_types,
} from '../__mocks__';

import ArmorTable from 'views/ArmorTable.jsx';

describe('ArmorTable', () => {
    const fullProps = {
        armor: {
            1: {
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
            }
        },
    };

    beforeAll(() => {
        fetch.mockImplementation( mockedApi({
            armor_types,
            user: {},
            'armor/api': fullProps.armor,
        }) );
    })

    afterAll(() => {
        fetch.resetMocks()
    })

    describe('render', () => {
        it('should work without props', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/armor/list`}}>
                    <ArmorTable />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with all props', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/armor/list`}}>
                    <ArmorTable
                        {...fullProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should filter', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/armor/list`}}>
                    <ArmorTable
                        {...fullProps}
                        search="plate"
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
