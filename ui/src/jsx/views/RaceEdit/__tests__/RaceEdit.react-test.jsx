import React from 'react';
import { mount } from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';

import ListDataActions from 'actions/ListDataActions';
import {
    mockedApi,
    races,
} from '../../../../../tests/__mocks__';

import { RaceEdit } from '..';

describe.skip('View RaceEdit', () => {
    const fullProps = {
    };

    beforeAll(() => fetch.mockImplementation(mockedApi({
        races,
    })));

    afterAll(() => fetch.resetMocks());

    it('should render w/ minimum props', () => {
        const tree = renderer.create(
            <RaceEdit />
        );

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should render w/ all props', () => {
        const tree = renderer.create(
            <RaceEdit {...fullProps} />
        );

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
