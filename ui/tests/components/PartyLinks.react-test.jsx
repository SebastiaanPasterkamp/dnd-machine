import React from 'react';
import { PartyLinks } from 'components/PartyLinks.jsx';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('Component: PartyLinks', () => {
    it('should render without props', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <PartyLinks
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a new button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <PartyLinks
                    current_user={{
                        id: 1,
                        role: ['dm'],
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show admin buttons', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <PartyLinks
                    party_id={10}
                    party={{
                        id: 10,
                        user_id: 2,
                    }}
                    current_user={{
                        id: 1,
                        role: ['admin'],
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a view and host button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <PartyLinks
                    party_id={10}
                    party={{
                        id: 10,
                        user_id: 1,
                    }}
                    current_user={{
                        id: 2,
                        role: ['dm'],
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a view, host, and edit button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <PartyLinks
                    party_id={10}
                    party={{
                        id: 10,
                        user_id: 1,
                    }}
                    current_user={{
                        id: 1,
                        role: ['dm'],
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a stop button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <PartyLinks
                    party_id={10}
                    party={{
                        id: 10,
                        user_id: 1,
                    }}
                    hosted_party={{
                        id: 10,
                    }}
                    current_user={{
                        id: 2,
                        role: ['dm'],
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should still show a host button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <PartyLinks
                    party_id={10}
                    party={{
                        id: 10,
                        user_id: 1,
                    }}
                    hosted_party={{
                        id: 11,
                    }}
                    current_user={{
                        id: 2,
                        role: ['dm'],
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
