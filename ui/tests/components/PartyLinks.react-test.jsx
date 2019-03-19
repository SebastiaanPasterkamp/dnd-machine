import React from 'react';
import { mount } from 'enzyme';
import { PartyLinks } from 'components/PartyLinks.jsx';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('Component: PartyLinks', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

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

    it('should show a view, host, edit, and delete button', () => {
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

    it('hosting should work', () => {

        fetch.mockResponseOnce(JSON.stringify({
            id: 10,
            user_id: 1,
            name: 'Host me',
        }));

        const wrapper = mount(
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
        );

        wrapper
            .find('a.fa-beer')
            .simulate('click');

        expect(fetch).toBeCalledWith(
            '/party/host/10',
            {
                credentials: 'same-origin',
                method: 'POST',
                'headers': {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }
        );
    });

    it('stop hosting should work', () => {

        fetch.mockResponseOnce(JSON.stringify({
            id: 10,
            user_id: 1,
            name: 'Host me',
        }));

        const wrapper = mount(
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
        );

        wrapper
            .find('a.fa-ban')
            .simulate('click');

        expect(fetch).toBeCalledWith(
            '/party/host',
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
