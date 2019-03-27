import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { TreasureCheckpoints } from '../components/TreasureCheckpoints';

describe('TreasureCheckpoints', () => {
    const fullProps = {
        label: "Example TCP",
        className: "example-tcp",
    };

    it('should render with minimum props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <TreasureCheckpoints
                setState={setState}
                label={fullProps.label}
            />
        );

        expect(tree).toMatchSnapshot();
    });
});