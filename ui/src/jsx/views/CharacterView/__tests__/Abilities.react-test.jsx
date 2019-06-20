import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Abilities from '../components/Abilities';
import { abilities } from '../__mocks__/character';

describe('Abilities', () => {
    const fullProps = {
        abilities,
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
