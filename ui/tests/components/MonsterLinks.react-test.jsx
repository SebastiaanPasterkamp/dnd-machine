import React from 'react';
import { mount } from 'enzyme';
import { MonsterLinks } from 'components/MonsterLinks.jsx';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('Component: MonsterLinks', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it('should render without props', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <MonsterLinks
                    />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a new button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <MonsterLinks
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
                <MonsterLinks
                    monster_id={10}
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
                <MonsterLinks
                    monster_id={10}
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
                <MonsterLinks
                    monster_id={10}
                    current_user={{
                        id: 1,
                        role: ['admin'],
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
        }));

        const wrapper = mount(
            <MemoryRouter>
                <MonsterLinks
                    monster_id={10}
                    current_user={{
                        id: 1,
                        role: ['dm'],
                    }}
                    />
            </MemoryRouter>
        );

        wrapper
            .find('a.fa-clone')
            .simulate('click');

        expect(fetch).toBeCalledWith(
            '/monster/copy/10',
            {
                credentials: 'same-origin',
                method: 'GET',
                'headers': {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }
        );
    });
});
