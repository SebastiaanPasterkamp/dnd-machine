import React from 'react';
import { mount } from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';

import ListDataActions from 'actions/ListDataActions';
import {
    mockedApi,
    classes,
} from '../../../../../tests/__mocks__';

import { BackgroundEdit } from '..';

describe.skip('View BackgroundEdit', () => {
    const fullProps = {
    };

    beforeAll(() => fetch.mockImplementation(mockedApi({
        classes,
    })));

    afterAll(() => fetch.resetMocks());

    it('should render w/ minimum props', () => {
        const tree = renderer.create(
            <BackgroundEdit />
        );

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should render w/ all props', () => {
        const tree = renderer.create(
            <BackgroundEdit {...fullProps} />
        );

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
