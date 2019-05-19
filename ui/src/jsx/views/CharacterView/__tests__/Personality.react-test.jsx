import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Personality from '../components/Personality';

describe('Personality', () => {
    const fullProps = {
        traits: "I am a _good eater_.",
        ideals: "Eat the whole day.",
        bonds: "I like anyone who will feed me.",
        flaws: "I sometimes eat **too** much.",
    };

    it('should render without props', () => {
        const tree = renderer.create(
            <Personality />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <Personality {...fullProps} />
        );

        expect(tree).toMatchSnapshot();
    });
});
