import React from 'react';
import { mount } from 'enzyme';
import { AdventureLeagueLogLinks } from 'components/AdventureLeagueLogLinks.jsx';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('Component: AdventureLeagueLogLinks', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it('should render without props', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <AdventureLeagueLogLinks
                    />
            </MemoryRouter>
        );

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
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render a new button for a character', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <AdventureLeagueLogLinks
                    characterId={123}
                    current_user={{
                        id: 1,
                        dci: "1234",
                        role: ['player'],
                    }}
                    />
            </MemoryRouter>
        );

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
        );

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
        );

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
        );

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
        );

        expect(tree).toMatchSnapshot();
    });

    it('delete should confirm, then submit', () => {
        global.confirm = jest.fn();
        global.confirm.mockReturnValueOnce(true);

        fetch.mockResponseOnce('{}');

        const wrapper = mount(
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
        );

        wrapper
            .find('a.fa-trash-o')
            .simulate('click');

        expect(global.confirm).toHaveBeenCalled();
        global.confirm.mockRestore();

        expect(fetch).toBeCalledWith(
            '/log/adventureleague/api/100',
            {
                credentials: 'same-origin',
                method: 'DELETE',
                'headers': {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }
        );
    });

    it('delete should not submit without confirm', () => {
        global.confirm = jest.fn();
        global.confirm.mockReturnValueOnce(false);

        fetch.mockResponseOnce('{}');

        const wrapper = mount(
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
        );

        wrapper
            .find('a.fa-trash-o')
            .simulate('click');

        expect(global.confirm).toHaveBeenCalled();
        global.confirm.mockRestore();

        expect(fetch).not.toBeCalled();
    });
});
