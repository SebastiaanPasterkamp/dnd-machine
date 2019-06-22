import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ListDataActions from 'actions/ListDataActions';
import {
    mockedApi,
    alignments,
    genders,
} from '../__mocks__';

import PartyEdit from 'views/PartyEdit.jsx';

describe('PartyEdit', () => {
    const fullProps = {
        id: 1,
        name: 'Party boat',
        description: 'Choo choo, mothers/fathers!',
        challenge: {
            easy: 10,
            medium: 20,
            hard: 40,
            deadly: 80,
        },
        member_ids: [1, 2],
        characters: {
            1: {
                id: 1,
                user_id: 6,
                name: 'Thing One',
                race: 'Drow',
                'class': 'Rogue',
                background: 'Entertainer',
                gender: "male",
                alignment: "chaotic good",
                level: 1,
                xp_progress: 50,
                xp_level: 300,
            },
            2: {
                id: 2,
                user_id: 6,
                name: 'Thing Two',
                race: 'Drow',
                'class': 'Rogue',
                background: 'Entertainer',
                gender: "female",
                alignment: "chaotic good",
                level: 1,
                xp_progress: 50,
                xp_level: 300,
            },
            3: {
                id: 3,
                user_id: 5,
                name: 'The Cat',
                race: 'Tabaxi',
                'class': 'Bard',
                background: 'Entertainer',
                gender: "male",
                alignment: "chaotic good",
                level: 1,
                xp_progress: 50,
                xp_level: 300,
            },
        },
        reload: jest.fn(),
        setState: jest.fn(),
    };

    beforeAll(() => {
        fetch.mockImplementation( mockedApi({
            alignments,
            user: {},
            '/character/api$': fullProps.characters,
            genders,
        }) );
        ListDataActions.fetchItems('alignments', 'items');
        ListDataActions.fetchItems('character', 'items');
        ListDataActions.fetchItems('genders', 'items');
    });

    afterAll(() => fetch.resetMocks());

    afterEach(() => {
        fullProps.reload.mockClear();
        fullProps.setState.mockClear();
    });

    describe('render', () => {
        it('should work without props', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/party/edit/${fullProps.id}`}}>
                    <PartyEdit.WrappedComponent.WrappedComponent
                        reload={fullProps.reload}
                        setState={fullProps.setState}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work without characters', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/party/edit/${fullProps.id}`}}>
                    <PartyEdit.WrappedComponent.WrappedComponent
                        {...fullProps}
                        characters={undefined}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with all props', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/party/edit/${fullProps.id}`}}>
                    <PartyEdit.WrappedComponent.WrappedComponent
                        {...fullProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });
    });

    describe('when making changes', () => {
        let wrapper;
        const setState = jest.fn();

        beforeAll(() => {
            wrapper = mount(
                <MockRouter location={{pathname: `/party/new`}}>
                    <PartyEdit
                        {...fullProps}
                        setState={setState}
                    />
                </MockRouter>
            );
        });

        afterEach(() => setState.mockClear());

        it('will change the name', () => {
            const { name } = fullProps;
            wrapper
                .find('input[placeholder="Name..."]')
                .simulate('change', {target: {value: name}});
            expect(setState).toBeCalledWith({ name });
        });

        it('will change the description', () => {
            const { description } = fullProps;
            wrapper
                .find('textarea[placeholder="Description..."]')
                .simulate('change', {target: {value: description}});
            expect(setState).toBeCalledWith({ description });
        });

        it('will remove deleted characters', () => {
            wrapper
                .find('.fa-times')
                .at(0)
                .simulate('click');
            expect(setState).toBeCalledWith(
                { member_ids: [ 2 ] },
                expect.any(Function)
            );
        });

        it('will add new characters', () => {
            wrapper
                .find('.fa-plus.default')
                .simulate('click');
            wrapper
                .find('input[placeholder="Filter..."]')
                .simulate('change', {target: {value: 'cat'}});
            wrapper
                .find('.modal-dialog .fa-plus')
                .at(0)
                .simulate('click');
            expect(setState).toBeCalledWith(
                { member_ids: [ 3, 1, 2 ] },
                expect.any(Function)
            );
        });
    });
});
