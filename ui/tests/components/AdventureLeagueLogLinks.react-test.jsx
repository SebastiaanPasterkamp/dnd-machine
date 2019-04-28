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
                <AdventureLeagueLogLinks />
            </MemoryRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render a new button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <AdventureLeagueLogLinks
                    currentUser={{
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
                    currentUser={{
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
                    id={100}
                    currentUser={{
                        id: 1,
                        role: ['player'],
                    }}
                    adventureleague={{
                        user_id: 1,
                        consumed: false,
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
                    id={100}
                    currentUser={{
                        id: 2,
                        role: ['admin'],
                    }}
                    adventureleague={{
                        user_id: 1,
                        consumed: false,
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
                    id={100}
                    currentUser={{
                        id: 1,
                        role: ['player'],
                    }}
                    adventureleague={{
                        user_id: 1,
                        character_id: 10,
                        consumed: false,
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
                    id={100}
                    currentUser={{
                        id: 1,
                        role: ['player'],
                    }}
                    adventureleague={{
                        user_id: 1,
                        character_id: 10,
                        consumed: true,
                    }}
                />
            </MemoryRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    describe('delete should', () => {
        it('confirm, then submit', () => {
            global.confirm = jest.fn();
            global.confirm.mockReturnValueOnce(true);

            fetch.mockResponseOnce('{}');

            const wrapper = mount(
                <MemoryRouter>
                    <AdventureLeagueLogLinks
                        id={100}
                        currentUser={{
                            id: 1,
                            role: ['player'],
                        }}
                        adventureleague={{
                            user_id: 1,
                            consumed: false,
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

        it('not submit without confirm', () => {
            global.confirm = jest.fn();
            global.confirm.mockReturnValueOnce(false);

            fetch.mockResponseOnce('{}');

            const wrapper = mount(
                <MemoryRouter>
                    <AdventureLeagueLogLinks
                        id={100}
                        currentUser={{
                            id: 1,
                            role: ['player'],
                        }}
                        adventureleague={{
                            user_id: 1,
                            consumed: false,
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

    describe('consume should', () => {
        it('confirm, then submit', () => {
            global.confirm = jest.fn();
            global.confirm.mockReturnValueOnce(true);

            fetch.mockResponseOnce('{}');

            const wrapper = mount(
                <MemoryRouter>
                    <AdventureLeagueLogLinks
                        id={100}
                        currentUser={{
                            id: 1,
                            role: ['player'],
                        }}
                        adventureleague={{
                            user_id: 1,
                            character_id: 2,
                            consumed: false,
                        }}
                    />
                </MemoryRouter>
            );

            wrapper
                .find('a.fa-thumb-tack')
                .simulate('click');

            expect(global.confirm).toHaveBeenCalled();
            global.confirm.mockRestore();

            expect(fetch).toBeCalledWith(
                '/log/adventureleague/consume/100',
                {
                    credentials: 'same-origin',
                    method: 'PATCH',
                    'headers': {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }
            );
        });

        it('not submit without confirm', () => {
            global.confirm = jest.fn();
            global.confirm.mockReturnValueOnce(false);

            fetch.mockResponseOnce('{}');

            const wrapper = mount(
                <MemoryRouter>
                    <AdventureLeagueLogLinks
                        id={100}
                        currentUser={{
                            id: 1,
                            role: ['player'],
                        }}
                        adventureleague={{
                            user_id: 1,
                            character_id: 2,
                            consumed: false,
                        }}
                    />
                </MemoryRouter>
            );

            wrapper
                .find('a.fa-thumb-tack')
                .simulate('click');

            expect(global.confirm).toHaveBeenCalled();
            global.confirm.mockRestore();

            expect(fetch).not.toBeCalled();
        });
    });
});
