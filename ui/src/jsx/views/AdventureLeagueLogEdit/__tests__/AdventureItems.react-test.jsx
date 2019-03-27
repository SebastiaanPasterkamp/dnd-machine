import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { AdventureItems } from '../components/AdventureItems';

describe('AdventureItems', () => {
    const fullProps = {
        label: "Example Items",
        className: "example-items",
    };

    it('should render with minimum props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <AdventureItems
                setState={setState}
                label={fullProps.label}
            />
        );

        expect(tree).toMatchSnapshot();
    });
});