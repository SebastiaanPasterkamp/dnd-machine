import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { Skills } from '../components/Skills';

describe('Skills', () => {
    const fullProps = {
        statistics: [
            {
                code: "strength",
                label: "Strength",
            },
            {
                code: "wisdom",
                label: "Wisdom",
            },
        ],
        skills: [
            {
                code: "athletics",
                label: "Athletics",
                stat: "strength",
            },
            {
                code: "insight",
                label: "Insight",
                stat: "wisdom",
            },
            {
                code: "survival",
                label: "Survival",
                stat: "wisdom",
            },
        ],
        skillBonus: {
            athletics: 7,
            insight: -1,
            survival: 1,
        },
        proficiencies: {
            skills: [ "athletics", "survival" ],
            expertise: [ "athletics" ],
        },
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
