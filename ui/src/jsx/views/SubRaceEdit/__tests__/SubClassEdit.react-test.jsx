import React from 'react';
import { mount } from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';

import ListDataActions from 'actions/ListDataActions';
import {
    mockedApi,
    classes,
} from '../../../../../tests/__mocks__';

import { SubRaceEdit } from '..';

describe.skip('View SubRaceEdit', () => {
    const fullProps = {
    };

    beforeAll(() => fetch.mockImplementation(mockedApi({
        classes,
    })));

    afterAll(() => fetch.resetMocks());

    it('should render w/ minimum props', () => {
        const tree = renderer.create(
            <SubRaceEdit />
        );

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should render w/ all props', () => {
        const tree = renderer.create(
            <SubRaceEdit {...fullProps} />
        );

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
