import React from 'react';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import {
    mockedApi,
} from '../../../../../tests/__mocks__';

import ClassLinks from '..';

describe('ClassLinks', () => {
    const props = {
        id: 1,
        currentUser: {
            role: ['admin'],
        },
        altStyle: true,
        children: <span>Hi</span>,
    };

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
            current_user: {},
        }) );
    });

    afterEach(() => fetch.resetMocks());

    it('should render with minimum props', () => {
        const tree = renderer.create(
            <MockRouter>
                <ClassLinks />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const tree = renderer.create(
            <MockRouter>
                <ClassLinks
                    {...props}
                />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render without current full props', () => {
        const tree = renderer.create(
            <MockRouter>
                <ClassLinks
                    {...props}
                    id={undefined}
                />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should not render links for non-admin', () => {
        const tree = renderer.create(
            <MockRouter>
                <ClassLinks
                    {...props}
                    currentUser={{
                        role: ['dm'],
                    }}
                />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });
});
