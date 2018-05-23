import React from 'react';
import { CharacterLinks } from 'components/CharacterLinks.jsx';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('Component: CharacterLinks', () => {
    it('should render without props', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <CharacterLinks
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a new button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <CharacterLinks
                    current_user={{
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
                    character_id={10}
                    character={{
                        user_id: 2,
                    }}
                    current_user={{
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
                    character_id={10}
                    character={{
                        user_id: 1,
                    }}
                    current_user={{
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
                    character_id={10}
                    character={{
                        user_id: 1,
                    }}
                    current_user={{
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
                    character_id={10}
                    character={{
                        user_id: 1,
                        level_up: {
                            config: [ 'test' ],
                        },
                    }}
                    current_user={{
                        id: 1,
                        role: ['player'],
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
