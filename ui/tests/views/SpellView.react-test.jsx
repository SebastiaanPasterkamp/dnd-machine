import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import {
    mockedApi,
    magic_components,
    magic_schools,
} from '../__mocks__';

import { SpellView } from 'views/SpellView.jsx';

describe('SpellView', () => {
    const fullProps = {
        id: 1,
        name: "Mage Hand",
        description: "Spooky action",
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
        }) );
    })

    afterEach(() => {
        fetch.resetMocks()
    })

    const listProps = {
        magic_components,
        magic_schools,
        _classes: [
            {
                id: "Wizard",
                name: "Wizard",
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
                <SpellView />
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with only list', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/spell/show/${fullProps.id}`}}>
                    <SpellView
                        {...listProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with only spell', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/spell/show/${fullProps.id}`}}>
                    <SpellView
                        {...fullProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with all props', () => {
            const tree = renderer.create(
                <MockRouter location={{pathname: `/items/spell/show/${fullProps.id}`}}>
                    <SpellView
                        {...listProps}
                        {...fullProps}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
