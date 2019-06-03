import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';
jest.useFakeTimers();

import {
    addApiResponse,
    localStorage,
    mockedApi,
    alignments,
    attack_modes,
    languages,
    monster_types,
    size_hit_dice,
    statistics,
    target_methods,
} from '../__mocks__';
import kobol from '../__mocks__/monster.json';

import EncounterView from 'views/EncounterView';
import ReportingActions from 'actions/ReportingActions';

describe('EncounterView', () => {
    const monster = {
        id: 2,
        ...kobol
    };
    const character = {
        id: 3,
        name: "Player #1",
        hit_points: 10,
        armor_class: 13,
        spell: {
            save_dc: 12,
        },
    };
    const hosted_party = {
        id: 4,
        name: "PartyBoat",
        user_id: 4,
        description: "_Choo choo_!",
        size: 1,
        member_ids: [ character.id ],
        challenge: {
            easy: 25,
            medium: 50,
            hard: 100,
            deadly: 200,
        },
        characters: {
            [character.id]: character,
        },
    };
    const fullProps = {
        id: 1,
        name: "Pillow fight!",
        description: "Feather's are **flying**",
        size: 2,
        monster_ids: [
            {id: monster.id, count: 2 }
        ],
        xp: 20,
        hosted_party,
        monsters: {
            [monster.id]: monster,
        },
        characters: {
            [character.id]: character,
        },
    };

    beforeAll(() => {
        global.localStorage = localStorage;
        fetch.mockImplementation( mockedApi({
            current_user: {},
            hosted_party: {},
            alignments,
            attack_modes,
            languages,
            monster_types,
            size_hit_dice,
            statistics,
            target_methods,
            'monster/api': {
                [monster.id]: monster,
            },
            'character/api': {
                [character.id]: character,
            },
        }) );
    })

    afterAll(() => {
        fetch.resetMocks()
    })

    it('should render without props', () => {
        const tree = renderer.create(
            <MockRouter location={{pathname: `/encounter/show/${fullProps.id}`}}>
                <EncounterView />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const tree = renderer.create(
            <MockRouter location={{pathname: `/encounter/show/${fullProps.id}`}}>
                <EncounterView {...fullProps} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should allow switching to combat', () => {
        const wrapper = mount(
            <MockRouter location={{pathname: `/encounter/show/${fullProps.id}`}}>
                <EncounterView {...fullProps} />
            </MockRouter>
        );

        expect(wrapper).toMatchSnapshot();

        wrapper
            .find('.fa-gamepad.warning')
            .simulate('click');

        expect(wrapper).toMatchSnapshot();
    });

    describe('initiative', () => {
        const { id } = character;
        const cardInfo = {
            initiative: 5,
            hp_missing: 3,
            hp_formula: '1+2',
            notes: 'Remember me',
        };

        beforeEach(() => {
            localStorage.setItem(
                `CombatantCard-1-character-${id}`,
                JSON.stringify(cardInfo)
            );
        });

        it('should be loaded from local storage', () => {
            const spy = jest.spyOn(localStorage, 'getItem');

            const wrapper = mount(
                <MockRouter location={{pathname: `/encounter/show/${fullProps.id}`}}>
                    <EncounterView {...fullProps} />
                </MockRouter>
            );

            expect(spy).toBeCalledWith(`CombatantCard-1-character-${id}`);
        });

        it('should reflect the stored state', () => {
            const wrapper = mount(
                <MockRouter location={{pathname: `/encounter/show/${fullProps.id}`}}>
                    <EncounterView {...fullProps} />
                </MockRouter>
            );

            const initiative = wrapper
                .find('summary.info input')
                .props()
                .value;

            expect(initiative).toBe(cardInfo.initiative);
        });

        it('should accept initiative input', () => {
            const wrapper = mount(
                <MockRouter location={{pathname: `/encounter/show/${fullProps.id}`}}>
                    <EncounterView {...fullProps} />
                </MockRouter>
            );

            wrapper
                .find('summary.brand input')
                .at(0)
                .simulate('change', { target: { value: 10 }});
            expect(wrapper).toMatchSnapshot();

            const initiative = wrapper
                .find('summary.brand input')
                .at(0)
                .prop('value');

            expect(initiative).toBe(10);

            wrapper
                .find('.fa-gamepad.warning')
                .simulate('click');

            expect(wrapper
                .find('summary.info')
                .at(0)
                .prop('style')
            ).toEqual({ order: -5 });
            expect(wrapper
                .find('summary.brand')
                .at(0)
                .prop('style')
            ).toEqual({ order: -10 });
        });
    });

    describe('during combat', () => {
        let wrapper;

        beforeAll(() => {
            wrapper = mount(
                <MockRouter location={{pathname: `/encounter/show/${fullProps.id}`}}>
                    <EncounterView {...fullProps} />
                </MockRouter>
            );
            wrapper
                .find('.fa-gamepad.warning')
                .simulate('click');
        });

        it('should update health', () => {
            wrapper
                .find('.nice-progress')
                .at(0)
                .hasClass('good');

            wrapper
                .find('summary input')
                .at(0)
                .simulate('change', {target: {value: '4+5'}});

            wrapper
                .find('.nice-progress')
                .at(0)
                .hasClass('warning');
        });

        it('should keep notes', () => {
            const note = 'Prone';
            wrapper
                .find('summary textarea')
                .at(0)
                .simulate('change', {target: {value: note}});

            wrapper
                .find('.fa-random')
                .simulate('click');
            wrapper
                .find('.fa-gamepad.warning')
                .simulate('click');

            expect(wrapper
                .find('summary textarea')
                .at(0)
                .prop('value')
            ).toEqual(note);
        });
    });
});
