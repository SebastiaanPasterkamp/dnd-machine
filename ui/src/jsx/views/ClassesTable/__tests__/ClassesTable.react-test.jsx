import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ObjectDataActions from 'actions/ObjectDataActions';
import ListDataActions from 'actions/ListDataActions';
import { mockedApi } from '../../../../../tests/__mocks__';

import ClassesTable from '..';

describe('ClassesTable', () => {

    beforeAll(() => {
        fetch.mockImplementation(mockedApi({
            class: {
                2: { id: 2, name: "Some class", description: "Foo _bar_" },
            },
            current_user: {
                id: 3,
                name: "Admin",
                role: [ "admin" ],
            },
        }));
        ObjectDataActions.getObject('class', 2);
        ListDataActions.fetchItems('current_user');
    });

    afterAll(() => fetch.resetMocks());

    it('should render without props', () => {
        const tree = renderer.create(
            <MockRouter>
                <ClassesTable options={undefined} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const tree = renderer.create(
            <MockRouter>
                <ClassesTable />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });
});
