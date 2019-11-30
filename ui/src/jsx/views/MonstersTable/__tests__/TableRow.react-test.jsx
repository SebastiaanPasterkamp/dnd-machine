import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ListDataActions from 'actions/ListDataActions';
import ObjectDataActions from 'actions/ObjectDataActions';
import {
    alignments,
    mockedApi,
    monster_types,
    size_hit_dice,
} from '../../../../../tests/__mocks__';

import TableRow from '../components/TableRow';

describe('TableRow', () => {
    const fullProps = {
        id: 1,
        name: "Bear",
        challenge_rating: 0.25,
        xp: 10,
    };

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
            alignments,
            campaign: {
                id: 2,
                name: "Circus",
                description: "Not your typical carnaval",
                user_id: 3,
            },
            current_user: {
                id: 1,
                role: ['dm'],
            },
            monster_types,
            size_hit_dice,
        }) );
        ListDataActions.fetchItems('alignments', 'items');
        ObjectDataActions.getObject('campaign', 2);
        ListDataActions.fetchItems('current_user');
        ListDataActions.fetchItems('monster_types', 'items');
        ListDataActions.fetchItems('size_hit_dice', 'items');
    })

    afterEach(() => fetch.resetMocks())

    it('should render', () => {
        const tree = renderer.create(
            <MockRouter>
                <TableRow {...fullProps} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with campaign', () => {
        const tree = renderer.create(
            <MockRouter>
                <TableRow
                    {...fullProps}
                    campaign_id={2}
                />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

});
