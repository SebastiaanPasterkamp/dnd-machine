import React from 'react';
import { EncounterLinks } from 'components/EncounterLinks.jsx';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('Component: EncounterLinks', () => {
    it('should render without props', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <EncounterLinks />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a new button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <EncounterLinks
                    currentUser={{
                        id: 1,
                        role: ['admin'],
                    }}
                />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should not show buttons for players', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <EncounterLinks
                    id={10}
                    currentUser={{
                        id: 1,
                        role: ['player'],
                    }}
                />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a view and edit button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <EncounterLinks
                    id={10}
                    currentUser={{
                        id: 1,
                        role: ['dm'],
                    }}
                />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
