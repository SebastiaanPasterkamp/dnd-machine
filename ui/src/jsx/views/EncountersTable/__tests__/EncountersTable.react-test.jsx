import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ListDataActions from 'actions/ListDataActions';
import ObjectDataActions from 'actions/ObjectDataActions.jsx';
import {
    mockedApi,
} from '../../../../../tests/__mocks__';
import EncountersTable from '..';

describe('EncountersTable', () => {

    beforeAll(() => {
        fetch.mockImplementation(mockedApi({
            campaign: {
                2: { id: 2, name: "Some campaign" },
            },
            current_user: {
                id: 3,
                name: "DM",
                role: [ "dm" ],
            },
            hosted_party: {
                challenge: {
                    easy: 10,
                    medium: 20,
                    hard: 30,
                    deadly: 40,
                },
            },
            'encounter/api': {
                1: {
                    id: 1,
                    campaign_id: 2,
                    name: 'Bar fight',
                    description: 'Beer & _Brawls_',
                    challenge_rating: 0.5,
                    xp_rating: 27.5,
                    xp: 25,
                },
            },
        }));
        ObjectDataActions.getObject('campaign', 2);
        ListDataActions.fetchItems('current_user');
        ListDataActions.fetchItems('hosted_party');
    });

    afterAll(() => fetch.resetMocks());

    it('should render without props', () => {
        const tree = renderer.create(
            <MockRouter>
                <EncountersTable encounters={undefined} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const tree = renderer.create(
            <MockRouter>
                <EncountersTable />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    describe('when filtering', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = mount(
                <MockRouter>
                    <EncountersTable />
                </MockRouter>
            );
        });

        it('should match on text', () => {
            expect(wrapper.find('[data-name=1]').length)
                .toEqual(1);

            wrapper
                .find('input[data-name="search"]')
                .simulate('change', {target: {value: 'ba'}});

            expect(wrapper.find('[data-name=1]').length)
                .toEqual(1);
        });

        it('should reject on text', () => {
            expect(wrapper.find('[data-name=1]').length)
                .toEqual(1);

            wrapper
                .find('input[data-name="search"]')
                .simulate('change', {target: {value: 'fo'}});

            expect(wrapper.find('[data-name=1]').length)
                .toEqual(0);
        });
    });
});
