import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Personality from '../components/Personality';
import { personality } from '../__mocks__/character';

describe('Personality', () => {
    const fullProps = personality;

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
