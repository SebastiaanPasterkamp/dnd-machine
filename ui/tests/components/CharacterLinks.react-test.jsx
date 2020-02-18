import React from 'react';
import { mount } from 'enzyme';
import { CharacterLinks } from 'components/CharacterLinks.jsx';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('Component: CharacterLinks', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it('should render without props', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <CharacterLinks />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a new button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <CharacterLinks
                    currentUser={{
                        id: 1,
                        role: ['player'],
                    }}
                />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show only readonly buttons', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <CharacterLinks
                    id={10}
                    character={{
                        user_id: 2,
                    }}
                    currentUser={{
                        id: 1,
                        role: ['player'],
                    }}
                />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show privileged buttons', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <CharacterLinks
                    id={10}
                    character={{
                        user_id: 1,
                    }}
                    currentUser={{
                        id: 1,
                        role: ['player'],
                    }}
                />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show admin buttons', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <CharacterLinks
                    id={10}
                    character={{
                        user_id: 1,
                    }}
                    currentUser={{
                        id: 2,
                        role: ['admin'],
                    }}
                />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a level-up button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <CharacterLinks
                    id={10}
                    character={{
                        user_id: 1,
                        level_up: {
                            config: [ 'test' ],
                        },
                    }}
                    currentUser={{
                        id: 1,
                        role: ['player'],
                    }}
                />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show AL buttons', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <CharacterLinks
                    id={10}
                    include={['log', 'logs']}
                    character={{
                        user_id: 1,
                        level_up: {
                            config: [ 'test' ],
                        },
                        adventure_league: true,
                    }}
                    currentUser={{
                        id: 1,
                        role: ['player'],
                        dci: '123123132',
                    }}
                />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('copy should work submit', () => {

        fetch.mockResponseOnce(JSON.stringify({
            id: 11,
            name: 'Example (copy)',
            user_id: 1,
        }));

        const wrapper = mount(
            <MemoryRouter>
                <CharacterLinks
                    id={10}
                    character={{
                        user_id: 1,
                    }}
                    currentUser={{
                        id: 1,
                        role: ['player'],
                    }}
                />
            </MemoryRouter>
        );

        wrapper
            .find('a.fa-clone')
            .simulate('click');

        expect(fetch).toBeCalledWith(
            '/character/copy/10',
            {
                credentials: 'same-origin',
                method: 'GET',
                'headers': {
                    'Accept': 'application/json'
                }
            }
        );
    });

    it('delete should confirm, then submit', () => {
        global.confirm = jest.fn();
        global.confirm.mockReturnValueOnce(true);

        fetch.mockResponseOnce('{}');

        const wrapper = mount(
            <MemoryRouter>
                <CharacterLinks
                    id={10}
                    character={{
                        user_id: 1,
                    }}
                    currentUser={{
                        id: 1,
                        role: ['player'],
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
            '/character/api/10',
            {
                credentials: 'same-origin',
                method: 'DELETE',
                'headers': {
                    'Accept': 'application/json'
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
                <CharacterLinks
                    id={10}
                    character={{
                        user_id: 1,
                    }}
                    currentUser={{
                        id: 1,
                        role: ['player'],
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
