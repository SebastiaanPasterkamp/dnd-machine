import React from 'react';
import { shallow, mount } from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';

import ListDataActions from 'actions/ListDataActions';
import {
    languages,
    mockedApi,
} from '../../../../../tests/__mocks__';
import PropertiesPanel from '../components/PropertiesPanel';

describe('View PropertiesPanel', () => {
    const fullProps = {
        challenge_rating_precise: 0.25,
        xp_rating: 10,
        motion: {
            walk: 20,
            swim: 40,
        },
        languages: [ 'common' ],
        traits: {
            'Foo bar': 'Bars _foo_ very well'
        },

    };

    beforeAll(() => {
        fetch.mockImplementation(mockedApi({
            languages,
        }));
        ListDataActions.fetchItems('languages', ['items', 'types']);
    });

    afterAll(() => {
        fetch.resetMocks();
    });

    describe('rendering', () => {
        it('should work w/ minimum props', () => {
            const onSetState = jest.fn();
            const tree = renderer.create(
                <PropertiesPanel
                    setState={onSetState}
                />
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('should work w/ full props', () => {
            const onSetState = jest.fn();
            const tree = renderer.create(
                <PropertiesPanel
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
               <PropertiesPanel
                   setState={setState}
               />
           );
        });

        beforeEach(() => setState.mockClear());

        it('a trait name', () => {
            wrapped
                .find('.monster-edit__properties .list-component input')
                .simulate('change', {target: {
                    value: 'Foo bar',
                }});

            expect(setState).toBeCalledWith({
                traits: {
                    'Foo bar': undefined,
                },
            });
        });

        it('a trait description', () => {
            wrapped
                .find('textarea')
                .simulate('change', {target: {
                    value: 'Barring _foo_ very well',
                }});

            expect(setState).toBeCalledWith({
                traits: {
                    undefined: 'Barring _foo_ very well',
                },
            });
        });
    });
});
