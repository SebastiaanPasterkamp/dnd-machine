import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Backstory from '../components/Backstory';
import { backstory } from '../__mocks__/character';

describe('Backstory', () => {
    const fullProps = {
        backstory,
    };

    it('should render without props', () => {
        const tree = renderer.create(
            <Backstory />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <Backstory {...fullProps} />
        );

        expect(tree).toMatchSnapshot();
    });
});
