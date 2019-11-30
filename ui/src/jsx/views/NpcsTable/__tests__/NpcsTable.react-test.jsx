import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ListDataActions from 'actions/ListDataActions';
import ObjectDataActions from 'actions/ObjectDataActions.jsx';
import {
    mockedApi,
    alignments,
} from '../../../../../tests/__mocks__';
import NpcsTable from '..';

describe('NpcsTable', () => {

    beforeAll(() => {
        fetch.mockImplementation(mockedApi({
            alignments,
            campaign: {
                2: { id: 2, name: "Some campaign" },
            },
            current_user: {
                id: 3,
                name: "DM",
                role: [ "dm" ],
            },
            'npc/api': {
                1: {
                    id: 1,
                    name: "Annie",
                    race: "Human",
                    class: "Innkeeper",
                    alignment: "true neutral",
                    location: "Town",
                    organization: "Beer Guild",
                },
            },
        }));
        ListDataActions.fetchItems('alignments', 'items');
        ObjectDataActions.getObject('campaign', 2);
        ListDataActions.fetchItems('current_user');
    });

    afterAll(() => fetch.resetMocks());

    it('should render without props', () => {
        const tree = renderer.create(
            <MockRouter>
                <NpcsTable npcs={undefined} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const tree = renderer.create(
            <MockRouter>
                <NpcsTable />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    describe('when filtering', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = mount(
                <MockRouter>
                    <NpcsTable />
                </MockRouter>
            );
        });

        it('should match on text', () => {
            expect(wrapper.find('[data-name=1]').length)
                .toEqual(1);

            wrapper
                .find('input[data-name="search"]')
                .simulate('change', {target: {value: 'annie'}});

            expect(wrapper.find('[data-name=1]').length)
                .toEqual(1);
        });

        it('should reject on text', () => {
            expect(wrapper.find('[data-name=1]').length)
                .toEqual(1);

            wrapper
                .find('input[data-name="search"]')
                .simulate('change', {target: {value: 'nobody'}});

            expect(wrapper.find('[data-name=1]').length)
                .toEqual(0);
        });
    });
});
