import React from 'react';
import { CampaignLinks } from 'components/CampaignLinks.jsx';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('Component: CampaignLinks', () => {
    it('should render without props', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <CampaignLinks
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a new button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <CampaignLinks
                    currentUser={{
                        id: 1,
                        role: ['dm'],
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show only a view button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <CampaignLinks
                    id={10}
                    campaign={{
                        user_id: 2,
                    }}
                    currentUser={{
                        id: 1,
                        role: ['admin'],
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a view and edit button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <CampaignLinks
                    id={10}
                    campaign={{
                        user_id: 1,
                    }}
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
