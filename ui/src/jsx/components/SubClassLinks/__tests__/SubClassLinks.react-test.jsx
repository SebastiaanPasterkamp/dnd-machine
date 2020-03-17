import React from 'react';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import {
    mockedApi,
} from '../../../../../tests/__mocks__';

import SubClassLinks from '..';

describe('SubClassLinks', () => {
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
                <SubClassLinks />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const tree = renderer.create(
            <MockRouter>
                <SubClassLinks
                    {...props}
                />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render without current full props', () => {
        const tree = renderer.create(
            <MockRouter>
                <SubClassLinks
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
                <SubClassLinks
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
