import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import ListDataActions from 'actions/ListDataActions';
import {
    alignments,
    mockedApi,
    monster_types,
    size_hit_dice,
} from '../../../../../tests/__mocks__';

import MonstersFilter from '../components/MonstersFilter';

describe('MonstersFilter', () => {

    const fullProps = {
        text: 'bear',
        campaign: [2],
        size: ['small', 'medium'],
        type: ['beast', 'humanoid'],
        alignment: ['unaligned'],
        level: [1, 2, 3],
        cr: {
            min: 0.1,
            max: 0.75,
        },
        xp: {
            min: 5,
            max: 50,
        },
    };

    beforeAll(() => {
        fetch.mockImplementation( mockedApi({
            alignments,
            monster_types,
            size_hit_dice,
            campaign: {
                2: { id: 2, name: "Some campaign" },
            },
        }) );
        ListDataActions.fetchItems('alignments', 'items');
        ListDataActions.fetchItems('monster_types', 'items');
        ListDataActions.fetchItems('size_hit_dice', 'items');
    });

    afterAll(() => fetch.resetMocks());

    it('should render without props', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <MonstersFilter
                setState={setState}
            />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <MonstersFilter
                {...fullProps}
                setState={setState}
            />
        );

        expect(tree).toMatchSnapshot();
    });

    describe('when filtering', () => {
        let wrapper, setState;

        beforeEach(() => {
            setState = jest.fn();
            wrapper = mount(
                <MonstersFilter setState={setState} />
            );
        });

        it('should update text', () => {
            wrapper
                .find('input[data-name="search"]')
                .simulate('change', {target: {value: 'foo'}});

            expect(setState).toBeCalledWith({
                text: 'foo',
            });
        });

        it('should update attribute', () => {
            wrapper
                .find('[data-name="campaign"] [data-value=2] input')
                .simulate('change');

            expect(setState).toBeCalledWith({
                campaign: [2],
            });
        });

        it('should update min', () => {
            wrapper
                .find('[data-name="cr"] input')
                .at(0)
                .simulate('change', {target: {value: 1}});

            expect(setState).toBeCalledWith({
                cr: { min: 1, max: null }
            });
        });

        it('should update max', () => {
            wrapper
                .find('[data-name="xp"] input')
                .at(1)
                .simulate('change', {target: {value: 75}});

            expect(setState).toBeCalledWith({
                xp: { min: null, max: 75 }
            });
        });
    });
});
