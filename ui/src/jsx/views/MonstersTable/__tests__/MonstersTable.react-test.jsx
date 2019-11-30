import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ListDataActions from 'actions/ListDataActions';
import ObjectDataActions from 'actions/ObjectDataActions.jsx';
import {
    mockedApi,
    alignments,
    monster_types,
    size_hit_dice,
} from '../../../../../tests/__mocks__';
import MonstersTable from '..';

describe('MonstersTable', () => {

    beforeAll(() => {
        fetch.mockImplementation(mockedApi({
            alignments,
            campaign: {
                2: { id: 2, name: "Some campaign" },
            },
            monster_types,
            size_hit_dice,
            current_user: {
                id: 3,
                name: "DM",
                role: [ "dm" ],
            },
            'monster/api': {
                1: {
                    id: 1,
                    name: "Bear",
                    challenge_rating: 0.25,
                    xp: 10,
                },
            },
        }));
        ListDataActions.fetchItems('alignments', 'items');
        ListDataActions.fetchItems('monster_types', 'items');
        ListDataActions.fetchItems('size_hit_dice', 'items');
        ObjectDataActions.getObject('campaign', 2);
        ListDataActions.fetchItems('current_user');
    });

    afterAll(() => fetch.resetMocks());

    it('should render without props', () => {
        const tree = renderer.create(
            <MockRouter>
                <MonstersTable monsters={undefined} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const tree = renderer.create(
            <MockRouter>
                <MonstersTable />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    describe('when filtering', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = mount(
                <MockRouter>
                    <MonstersTable />
                </MockRouter>
            );
        });

        it('should match on text', () => {
            expect(wrapper.find('[data-name=1]').length)
                .toEqual(1);

            wrapper
                .find('input[data-name="search"]')
                .simulate('change', {target: {value: 'bear'}});

            expect(wrapper.find('[data-name=1]').length)
                .toEqual(1);
        });

        it('should reject on text', () => {
            expect(wrapper.find('[data-name=1]').length)
                .toEqual(1);

            wrapper
                .find('input[data-name="search"]')
                .simulate('change', {target: {value: 'bar'}});

            expect(wrapper.find('[data-name=1]').length)
                .toEqual(0);
        });
    });
});
