import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { AdventureDelta } from '../components/AdventureDelta';

describe('AdventureDelta', () => {
    const fullProps = {
        label: "Example Delta",
        starting: 20,
        earned: 5,
        total: 25,
        disabled: true,
        className: "example-delta",
    };

    it('should render with minimum props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <AdventureDelta
                setState={setState}
                label={fullProps.label}
            />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <AdventureDelta
                setState={setState}
                {...fullProps}
            />
        );

        expect(tree).toMatchSnapshot();
    });

    it('AdventureDelta should emit change', () => {
        const setState = jest.fn();

        const tree = mount(
            <AdventureDelta
                setState={setState}
                label={fullProps.label}
                starting={fullProps.starting}
            />
        );

        tree
            .find('input[data-field="earned"]')
            .simulate('change', {target: {
                value: "2+3",
            }});

        expect(setState).toBeCalledWith({
            starting: fullProps.starting,
            earned: fullProps.earned,
            total: fullProps.total,
        })
        expect(tree.state()).toMatchSnapshot();
    });
});
