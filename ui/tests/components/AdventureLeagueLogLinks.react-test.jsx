import React from 'react';
import { AdventureLeagueLogLinks } from 'components/AdventureLeagueLogLinks.jsx';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('Component: AdventureLeagueLogLinks', () => {
    it('should render without props', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <AdventureLeagueLogLinks
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a new button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <AdventureLeagueLogLinks
                    current_user={{
                        id: 1,
                        dci: "1234",
                        role: ['player'],
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show all buttons for the owner', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <AdventureLeagueLogLinks
                    logId={100}
                    current_user={{
                        id: 1,
                        role: ['player'],
                    }}
                    adventureleague={{
                        user_id: 1,
                        consumed: 0,
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show some buttons for an admin', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <AdventureLeagueLogLinks
                    logId={100}
                    current_user={{
                        id: 2,
                        role: ['admin'],
                    }}
                    adventureleague={{
                        user_id: 1,
                        consumed: 0,
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should replace assign with consume', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <AdventureLeagueLogLinks
                    logId={100}
                    current_user={{
                        id: 1,
                        role: ['player'],
                    }}
                    adventureleague={{
                        user_id: 1,
                        character_id: 10,
                        consumed: 0,
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should hide consume', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <AdventureLeagueLogLinks
                    logId={100}
                    current_user={{
                        id: 1,
                        role: ['player'],
                    }}
                    adventureleague={{
                        user_id: 1,
                        character_id: 10,
                        consumed: 1,
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
