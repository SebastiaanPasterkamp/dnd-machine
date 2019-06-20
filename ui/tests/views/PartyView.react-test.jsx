import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import { addApiResponse, mockedApi } from '../__mocks__';

import { PartyView } from '../../src/jsx/views/PartyView.jsx';

describe('PartyView', () => {
    const dmUser = {
        id: 2,
        name: "DM",
        role: [ "dm", "player" ],
        username: "Dungeon Master",
    };
    const playerUser = {
        id: 2,
        name: "player",
        role: [ "player" ],
        username: "Player #1",
    };
    const fullProps = {
        id: 1,
        name: "PartyBoat",
        user_id: dmUser.id,
        description: "I'm on _a boat_!",
        size: 2,
        member_ids: [3, 4],
        challenge: {
            easy: 50,
            medium: 100,
            hard: 200,
            deadly: 400,
        },
        characters: {
            3: {
                id: 3,
                user_id: dmUser.id,
                name: 'Foo Fighter',
                level: 1,
                challenge: { easy: 25, medium: 50, hard: 100, deadly: 200 },
            },
            4: {
                id: 4,
                user_id: playerUser.id,
                name: 'Bar Brawler',
                level: 1,
                challenge: { easy: 25, medium: 50, hard: 100, deadly: 200 },
            },
        },
    };

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
            hosted_party: {},
            'character/api/3$': fullProps.characters[3],
            'character/api/4$': fullProps.characters[4],
            'party/api/1$': fullProps,
            'user/api/2$': dmUser,
            'user/api/3$': playerUser,
        }) );
    })

    afterEach(() => {
        fetch.resetMocks()
    })

    it('should render without props', () => {
        addApiResponse({
            current_user: dmUser,
        });
        const tree = renderer.create(
            <MockRouter location={{pathname: `/party/edit/${fullProps.id}`}}>
                <PartyView />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        addApiResponse({
            current_user: dmUser,
        });
        const tree = renderer.create(
            <MockRouter location={{pathname: `/party/edit/${fullProps.id}`}}>
                <PartyView {...fullProps} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });
});
