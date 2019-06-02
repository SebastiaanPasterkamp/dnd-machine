import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Traits from '../components/Traits';
import { info } from '../__mocks__/character';

describe('Traits', () => {
    const fullProps = {
        info,
    };

    it('should render without props', () => {
        const tree = renderer.create(
            <Traits />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <Traits {...fullProps} />
        );

        expect(tree).toMatchSnapshot();
    });
});
