import React from 'react';
import { ArmorLinks } from 'components/ArmorLinks.jsx';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('Component: ArmorLinks', () => {
    it('should render without props', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <ArmorLinks
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a new button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <ArmorLinks
                    current_user={{
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
                <ArmorLinks
                    armor_id={10}
                    current_user={{
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
                <ArmorLinks
                    armor_id={10}
                    current_user={{
                        id: 1,
                        role: ['dm'],
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
