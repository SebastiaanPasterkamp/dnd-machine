import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import ListDataActions from 'actions/ListDataActions';
import {
    mockedApi,
    classes,
    damage_types,
    magic_components,
    magic_schools,
} from '../__mocks__';

import SpellEdit from 'views/SpellEdit.jsx';

describe('SpellEdit', () => {
    const fullProps = {
        id: 1,
        name: "Mage Hand",
        description: "Spooky action",
        damage: {
            dice_count: 1,
            dice_size: 4,
            type: "fire",
        },
        level: "Cantrip",
        casting_time: "1 action",
        duration: "10 minutes",
        concentration: true,
        components: ["vocal", "somatic", "material"],
        cost: "Entangled photon",
        range: "60",
        school: "illusion",
        classes: ["Wizard"],
    };

    beforeAll(() => {
        fetch.mockImplementation( mockedApi({
            current_user: {},
            classes,
            damage_types: [
                damage_types[0],
                damage_types[3],
            ],
            magic_components,
            magic_schools,
        }) );
        ListDataActions.fetchItems('classes');
        ListDataActions.fetchItems('magic_components');
        ListDataActions.fetchItems('magic_schools');
        ListDataActions.fetchItems('damage_types');
        ListDataActions.fetchItems('current_user');
    })

    afterAll(() => {
        fetch.resetMocks()
    })

    const listProps = {
        damage_types: [
            {
                id: "fire",
                name: "Fire",
                short: "Fire",
                description: "Hot stuff",
            },
        ],
        magic_components: [
            {
                id: "somatic",
                name: "Somatic",
                short: "S",
                description: "Gestures",
            },
            {
                id: "verbal",
                name: "Verbal",
                short: "V",
                description: "Spoken",
            },
            {
                id: "material",
                name: "Material",
                short: "M",
                description: "Stuff",
            },
        ],
        magic_schools: [
            {
                id: "enchantment",
                name: "Enchantment",
                description: "Magically entrance people.",
            },
            {
                id: "illusion",
                name: "Illusion",
                description: "Magic that dazzles the senses.",
            },
        ],
        _classes: [
            {
                id: "Wizard",
                name: "Wizard",
                description: "Especially",
            },
        ],
    };

    describe('render', () => {
        it('should work without props', () => {
            const tree = renderer.create(
                <SpellEdit.WrappedComponent.WrappedComponent />
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with only list', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/spell/show/${fullProps.id}`}}>
                    <SpellEdit.WrappedComponent.WrappedComponent
                        {...listProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with only spell', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/spell/show/${fullProps.id}`}}>
                    <SpellEdit.WrappedComponent.WrappedComponent
                        {...fullProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with all props', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/spell/show/${fullProps.id}`}}>
                    <SpellEdit.WrappedComponent.WrappedComponent
                        {...listProps}
                        {...fullProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });
    });

    describe('when editing the basics', () => {
        let wrapper;
        let component;
        const setState = jest.fn();

        beforeEach(() => {
            wrapper = mount(
                <MockRouter location={{pathname: '/items/spell/new'}}>
                    <SpellEdit setState={setState}/>
                </MockRouter>
            );
            component = wrapper.find(SpellEdit);
        });

        afterEach(() => setState.mockClear());

        it('can change the name', () => {
            const { name } = fullProps;
            wrapper
                .find('input[placeholder="Name..."]')
                .simulate('change', {target: {value: name}});
            expect(setState).toBeCalledWith({ name });
        });

        it('set material should issue cost', () => {
            const { cost } = fullProps;
            wrapper
                .find('li[data-value="material"]')
                .simulate('click');
            expect(setState).toBeCalledWith({
                cost: '',
                components: ['material'],
            });
        });
    });

    it('should emit corrections when loading invalid combinations', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <MockRouter location={{pathname: '/items/spell/new'}}>
                <SpellEdit
                    setState={setState}
                    components={[]}
                    cost={fullProps.cost}
                />
            </MockRouter>
        );

        expect(setState).toBeCalledWith({ cost: undefined });
    });
});
