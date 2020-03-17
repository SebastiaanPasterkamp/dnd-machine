import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ObjectDataActions from 'actions/ObjectDataActions';
import ListDataActions from 'actions/ListDataActions';
import { mockedApi } from '../../../../../tests/__mocks__';

import RacesTable from '..';

describe('RacesTable', () => {

    beforeAll(() => {
        fetch.mockImplementation(mockedApi({
            race: {
                2: {
                    id: 2,
                    name: "Some race",
                    description: "Foo _bar_",
                },
            },
            current_user: {
                id: 3,
                name: "Admin",
                role: [ "admin" ],
            },
        }));
        ObjectDataActions.getObject('race', 2);
        ListDataActions.fetchItems('current_user');
    });

    afterAll(() => fetch.resetMocks());

    it('should render without props', () => {
        const tree = renderer.create(
            <MockRouter>
                <RacesTable options={undefined} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const tree = renderer.create(
            <MockRouter>
                <RacesTable />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });
});
