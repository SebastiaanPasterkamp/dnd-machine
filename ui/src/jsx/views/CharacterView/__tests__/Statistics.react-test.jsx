import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { mockedApi } from '../../../../../tests/__mocks__';

import Statistics from '../components/Statistics';

describe('Statistics', () => {
    const fullProps = {
        stats: {
            base: {
                strength: 12,
                wisdom: 9,
            },
            modifiers: {
                strength: 1,
                wisdom: -1,
            },
        },
        proficiencies: {
            saving_throws: [ "strength" ],
        },
        saving_throws: {
            strength: 3,
            wisdom: -1,
        },
    };

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
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
        }) );
    })

    afterEach(() => {
        fetch.resetMocks()
    })

    it('should render without props', () => {
        const tree = renderer.create(
            <Statistics />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <Statistics {...fullProps} />
        );

        expect(tree).toMatchSnapshot();
    });
});
