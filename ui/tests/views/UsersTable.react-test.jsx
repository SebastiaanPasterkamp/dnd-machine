import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ListDataActions from 'actions/ListDataActions';
import {
    mockedApi,
    user_roles,
} from '../__mocks__';

import UsersTable from 'views/UsersTable.jsx';

describe('UsersTable', () => {
    const current_user = {
        id: 1,
        username: "yankees",
        name: "Jan Kees",
        role: [ "admin", "player", "dm" ],
        email: "foo@bar.com",
    };
    const fullProps = {
        current_user,
        users: {
            [current_user.id]: current_user,
        },
    };

    beforeAll(() => {
        fetch.mockImplementation( mockedApi({
            current_user,
            user_roles,
            'user/api': fullProps.users,
        }) );
        ListDataActions.fetchItems('current_user');
        ListDataActions.fetchItems('user_roles', 'items');
    })

    afterAll(() => {
        fetch.resetMocks()
    })

    describe('render', () => {
        it('should work without props', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/user/list`}}>
                    <UsersTable />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with all props', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/user/list`}}>
                    <UsersTable
                        {...fullProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should filter', () => {
            const wrapper = mount(
                <MockRouter location={{pathname: `/user/list`}}>
                    <UsersTable
                        {...fullProps}
                        search="john"
                    />
                </MockRouter>
            );

            expect(wrapper
                .find('.users-table .base-link-group')
                .length
            ).toBe(1);
        });
    });
});
