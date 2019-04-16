import React from 'react';
import { WeaponLinks } from 'components/WeaponLinks.jsx';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('Component: WeaponLinks', () => {
    it('should render without props', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <WeaponLinks />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a new button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <WeaponLinks
                    currentUser={{
                        id: 1,
                        role: ['admin'],
                    }}
                />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show only a view button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <WeaponLinks
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
                <WeaponLinks
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
