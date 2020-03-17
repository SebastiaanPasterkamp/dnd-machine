import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ListDataActions from 'actions/ListDataActions';
import { mockedApi } from '../../../../../tests/__mocks__';

import TableRow from '../components/TableRow';

describe('TableRow', () => {
    const fullProps = {
        id: 1,
        name: "Some option",
        description: "Describing the option",
    };

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
            current_user: {
                id: 1,
                role: ['admin'],
            },
        }) );
        ListDataActions.fetchItems('current_user');
    })

    afterEach(() => fetch.resetMocks())

    it('should render', () => {
        const tree = renderer.create(
            <MockRouter>
                <TableRow
                    {...fullProps}
                />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

});
