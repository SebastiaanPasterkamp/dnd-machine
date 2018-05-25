import React from 'react';
import { NpcLinks } from 'components/NpcLinks.jsx';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('Component: NpcLinks', () => {
    it('should render without props', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <NpcLinks
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a new button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <NpcLinks
                    current_user={{
                        id: 1,
                        role: ['dm'],
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show the normal buttons', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <NpcLinks
                    npc_id={10}
                    current_user={{
                        id: 1,
                        role: ['dm'],
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show nothing', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <NpcLinks
                    npc_id={10}
                    current_user={{
                        id: 1,
                        role: ['player'],
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show the raw button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <NpcLinks
                    npc_id={10}
                    current_user={{
                        id: 1,
                        role: ['admin'],
                    }}
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
