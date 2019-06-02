import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { mockedApi } from '../../../../../tests/__mocks__';
import character from '../__mocks__/character';

import Basics from '../components/Basics';

describe('Basics', () => {
    const fullProps = {
        ...character,
        statistics: undefined,
        stats: character.statistics,
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
