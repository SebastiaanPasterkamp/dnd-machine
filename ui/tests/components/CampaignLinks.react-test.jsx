import React from 'react';
import { mount } from 'enzyme';
import { CampaignLinks } from 'components/CampaignLinks.jsx';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('Component: CampaignLinks', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

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

    it('should show a view, edit, and activate button', () => {
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

    it('set current should work', () => {

        fetch.mockResponseOnce(JSON.stringify({
            id: 10,
            user_id: 1,
            name: 'Host me',
        }));

        const wrapper = mount(
            <MemoryRouter>
                <CampaignLinks
                    id={10}
                    campaign={{
                        id: 10,
                        user_id: 1,
                    }}
                    currentUser={{
                        id: 2,
                        role: ['dm'],
                    }}
                />
            </MemoryRouter>
        );

        wrapper
            .find('a.fa-folder-open-o')
            .simulate('click');

        expect(fetch).toBeCalledWith(
            '/campaign/current/10',
            {
                credentials: 'same-origin',
                method: 'POST',
                'headers': {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }
        );
    });

    it('unset current should work', () => {

        fetch.mockResponseOnce(JSON.stringify({
            id: 10,
            user_id: 1,
            name: 'Host me',
        }));

        const wrapper = mount(
            <MemoryRouter>
                <CampaignLinks
                    id={10}
                    party={{
                        id: 10,
                        user_id: 1,
                    }}
                    currentCampaign={{
                        id: 10,
                    }}
                    currentUser={{
                        id: 2,
                        role: ['dm'],
                    }}
                />
            </MemoryRouter>
        );

        wrapper
            .find('a.fa-folder-o')
            .simulate('click');

        expect(fetch).toBeCalledWith(
            '/campaign/current',
            {
                credentials: 'same-origin',
                method: 'POST',
                'headers': {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }
        );
    });
});
