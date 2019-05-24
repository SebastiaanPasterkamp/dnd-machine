import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Abilities from '../components/Abilities';

describe('Abilities', () => {
    const fullProps = {
        abilities: {
            Simple: {
                description: "Something simple",
            },
            Complex: {
                description: "%(prefix)s: %(number).2f",
                prefix: "Formatted",
                number: 1.12345,
            },
        },
    };

    it('should render without props', () => {
        const tree = renderer.create(
            <Abilities />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <Abilities
                {...fullProps}
            />
        );

        expect(tree).toMatchSnapshot();
    });
});
