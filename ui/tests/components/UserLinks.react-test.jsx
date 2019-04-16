import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import { UserLinks } from 'components/UserLinks.jsx';
import ObjectDataActions from 'actions/ObjectDataActions.jsx';

describe('Component: UserLinks', () => {
    it('should render without props', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <UserLinks />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a new button', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <UserLinks
                    currentUser={{
                        id: 1,
                        role: ['admin'],
                    }}
                />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should not show anything to non-self non-admin', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <UserLinks
                    id={1}
                    user={{
                        id: 1,
                        role: ['admin'],
                    }}
                    currentUser={{
                        id: 2,
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
                <UserLinks
                    id={1}
                    user={{
                        id: 1,
                        role: ['player'],
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
                <UserLinks
                    id={2}
                    currentUser={{
                        id: 1,
                        role: ['admin'],
                    }}
                />
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should trigger delete action when clicked', () => {
        const spy = jest.spyOn(ObjectDataActions, 'deleteObject');

        const wrapper = mount(
            <MemoryRouter>
                <UserLinks
                    id={2}
                    currentUser={{
                        id: 1,
                        role: ['admin'],
                    }}
                />
            </MemoryRouter>
        );

        wrapper.find('.fa-trash-o').simulate('click');

        expect(spy).toBeCalledWith("user", 2);
    });
});
