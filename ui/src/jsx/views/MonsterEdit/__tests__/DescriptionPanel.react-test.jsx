import React from 'react';
import { shallow, mount } from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';

import ListDataActions from 'actions/ListDataActions';
import {
    alignments,
    mockedApi,
    monster_types,
    size_hit_dice,
} from '../../../../../tests/__mocks__';
import DescriptionPanel from '../components/DescriptionPanel';

describe('View DescriptionPanel', () => {
    const fullProps = {
        id: 1,
        campaign_id: 2,
        name: 'Brawler',
        size: 'medium',
        type: 'humanoid',
        alignment: 'chaotic neutral',
        level: 1,
        armor_class: 10,
        description: 'Punchy',
        challenge_rating_precise: 0.25,
        xp_rating: 10,
    };

    beforeAll(() => {
        fetch.mockImplementation(mockedApi({
            alignments,
            campaign: {
                2: { id: 2, name: "Some campaign" },
            },
            monster_types,
            size_hit_dice,
        }));
        ListDataActions.fetchItems('alignments', 'items');
        ListDataActions.fetchItems('monster_types', 'items');
        ListDataActions.fetchItems('size_hit_dice', 'items');
    });

    afterAll(() => {
        fetch.resetMocks();
    });

    describe('rendering', () => {
        it('should work w/ minimum props', () => {
            const onSetState = jest.fn();
            const tree = renderer.create(
                <DescriptionPanel
                    setState={onSetState}
                />
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('should work w/ full props', () => {
            const onSetState = jest.fn();
            const tree = renderer.create(
                <DescriptionPanel
                    {...fullProps}
                    setState={onSetState}
                />
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });
    });

    describe('should handle changing', () => {
        const setState = jest.fn();
        let wrapped;

        beforeAll(() => {
            wrapped = mount(
               <DescriptionPanel
                   setState={setState}
               />
           );
        });

        beforeEach(() => setState.mockClear());

        it('the name', () => {
            wrapped
                .find('input')
                .simulate('change', {target: {
                    value: fullProps.name,
                }});

            expect(setState).toBeCalledWith({
                name: fullProps.name,
            });
        });

        it('the description', () => {
            wrapped
                .find('textarea')
                .simulate('change', {target: {
                    value: fullProps.description,
                }});

            expect(setState).toBeCalledWith({
                description: fullProps.description,
            });
        });
    });
});
