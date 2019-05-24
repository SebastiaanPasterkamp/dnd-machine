import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { mockedApi } from '../../../../../tests/__mocks__';

import Basics from '../components/Basics';

describe('Basics', () => {
    const fullProps = {
        armor_class: 12,
        armor_class_bonus: 2,
        hit_points: 13,
        level: 1,
        hit_dice: 10,
        speed: 30,
        height: 4.2,
        weight: 40,
        age: 25,
        initiative_bonus: 2,
        passive_perception: 11,
        proficiency: 2,
        spell: {
            stat: 'intelligence',
            safe_dc: 14,
            attack_modifier: 4,
        },
    };

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
            statistics: [
                {
                    code: "intelligence",
                    label: "Intelligence",
                    short: "Int",
                    description: "Smarts",
                },
            ],
        }) );
    })

    afterEach(() => {
        fetch.resetMocks()
    })

    it('should render without props', () => {
        const tree = renderer.create(
            <Basics />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <Basics {...fullProps} />
        );

        expect(tree).toMatchSnapshot();
    });
});
