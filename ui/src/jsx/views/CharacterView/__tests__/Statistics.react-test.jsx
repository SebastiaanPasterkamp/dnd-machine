import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { mockedApi, statistics } from '../../../../../tests/__mocks__';
import { statistics as stats, proficiencies, saving_throws } from '../__mocks__/character';

import Statistics from '../components/Statistics';

describe('Statistics', () => {
    const fullProps = {
        stats,
        proficiencies,
        saving_throws,
    };

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
            statistics,
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
