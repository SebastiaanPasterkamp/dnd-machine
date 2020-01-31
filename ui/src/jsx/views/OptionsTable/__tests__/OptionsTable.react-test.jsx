import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ObjectDataActions from 'actions/ObjectDataActions';
import ListDataActions from 'actions/ListDataActions';
import { mockedApi } from '../../../../../tests/__mocks__';

import OptionsTable from '..';

describe('OptionsTable', () => {

    beforeAll(() => {
        fetch.mockImplementation(mockedApi({
            options: {
                2: { id: 2, name: "Some option", description: "Describing" },
            },
            current_user: {
                id: 3,
                name: "Admin",
                role: [ "admin" ],
            },
        }));
        ObjectDataActions.getObject('options', 2);
        ListDataActions.fetchItems('current_user');
    });

    afterAll(() => fetch.resetMocks());

    it('should render without props', () => {
        const tree = renderer.create(
            <MockRouter>
                <OptionsTable options={undefined} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const tree = renderer.create(
            <MockRouter>
                <OptionsTable />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });
});
