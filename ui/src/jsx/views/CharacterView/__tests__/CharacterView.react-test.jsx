import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import {
    mockedApi,
    alignments,
    genders,
    skills,
    statistics,
    magic_components,
    magic_schools,
} from '../../../../../tests/__mocks__';
import character from '../__mocks__/character';

import CharacterView from '../CharacterView';

describe('CharacterView', () => {
    const fullProps = character;

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
            alignments,
            genders,
            skills,
            statistics,
            magic_components,
            magic_schools,
            current_user: {
                id: 1,
                name: "User",
                roles: [ "player" ],
            },
            'user/api/1': {
                id: 1,
                name: "User",
                roles: [ "player" ],
            },
            'character/api/1': character,
        }) );
    })

    afterEach(() => {
        fetch.resetMocks()
    })

    it('should render without props', () => {
        const tree = renderer.create(
            <MockRouter>
                <CharacterView />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <MockRouter>
                <CharacterView {...fullProps} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });
});
