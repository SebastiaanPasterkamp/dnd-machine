import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ListDataActions from 'actions/ListDataActions';
import { mockedApi } from '../../../../../tests/__mocks__';

import TableFooter from '../components/TableFooter';

describe('TableFooter', () => {

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
            current_user: {
                id: 1,
                role: ['dm'],
            },
        }) );
        ListDataActions.fetchItems('current_user');
    })

    afterEach(() => fetch.resetMocks())

    it('should render', () => {
        const tree = renderer.create(
            <MockRouter>
                <TableFooter />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

});
