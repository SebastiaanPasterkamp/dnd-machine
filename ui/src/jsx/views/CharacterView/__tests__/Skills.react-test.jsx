import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { statistics, skills } from '../../../../../tests/__mocks__';
import { Skills } from '../components/Skills';
import character from '../__mocks__/character';

describe('Skills', () => {
    const fullProps = {
        statistics,
        skills,
        skillBonus: character.skills,
        proficiencies: character.proficiencies,
    };

    it('should render without props', () => {
        const tree = renderer.create(
            <Skills />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <Skills {...fullProps} />
        );

        expect(tree).toMatchSnapshot();
    });
});
