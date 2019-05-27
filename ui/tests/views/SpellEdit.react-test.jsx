import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import { mockedApi, damage_types } from '../__mocks__';

import { SpellEdit } from 'views/SpellEdit.jsx';

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
        range: 60,
        school: "illusion",
        classes: ["Wizard"],
    };

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
            current_user: {},
            damage_types: [
                damage_types[0],
                damage_types[3],
            ],
        }) );
    })

    afterEach(() => {
        fetch.resetMocks()
    })

    const listProps = {
        damage_types: [
            {
                code: "fire",
                label: "Fire",
                short: "Fire",
                description: "Hot stuff",
            },
        ],
        magic_components: [
            {
                code: "somatic",
                label: "Somatic",
                short: "S",
                description: "Gestures",
            },
            {
                code: "verbal",
                label: "Verbal",
                short: "V",
                description: "Spoken",
            },
            {
                code: "material",
                label: "Material",
                short: "M",
                description: "Stuff",
            },
        ],
        magic_schools: [
            {
                code: "enchantment",
                label: "Enchantment",
                description: "Magically entrance people.",
            },
            {
                code: "illusion",
                label: "Illusion",
                description: "Magic that dazzles the senses.",
            },
        ],
        _classes: [
            {
                code: "Wizard",
                label: "Wizard",
                description: "Especially",
            },
        ],
    };

    afterEach(() => {
        fetch.resetMocks()
    })

    describe('render', () => {
        it('should work without props', () => {
            const tree = renderer.create(
                <SpellEdit />
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with only list', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/spell/show/${fullProps.id}`}}>
                    <SpellEdit
                        {...listProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with only spell', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/spell/show/${fullProps.id}`}}>
                    <SpellEdit
                        {...fullProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with all props', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/spell/show/${fullProps.id}`}}>
                    <SpellEdit
                        {...listProps}
                        {...fullProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
