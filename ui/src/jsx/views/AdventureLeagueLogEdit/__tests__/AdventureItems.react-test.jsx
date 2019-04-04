import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { AdventureItems } from '../components/AdventureItems';

describe('AdventureItems', () => {
    const fullProps = {
        label: "Example Items",
        className: "example-items",
        starting: 0,
        earned: ["Health Potion"],
        total: 1,
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

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <AdventureItems
                setState={setState}
                {...fullProps}
            />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should add an item', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <AdventureItems
                setState={setState}
                label={fullProps.label}
            />
        );

        wrapper
            .find('input[disabled=false]')
            .simulate('change', {target: {
                value: "Health Potion",
            }});

        expect(setState).toBeCalledWith({
            starting: 0,
            earned: ["Health Potion"],
            total: 1,
        });
    });

    it('should remove an item', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <AdventureItems
                setState={setState}
                {...fullProps}
            />
        );

        wrapper
            .find('input[disabled=false]')
            .at(0)
            .simulate('change', {target: {
                value: "",
            }});

        expect(setState).toBeCalledWith({
            starting: 0,
            earned: [],
            total: 0,
        });
    });

    it('should remove an empty item', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <AdventureItems
                setState={setState}
                {...fullProps}
            />
        );

        wrapper
            .find('button[name="del"]')
            .simulate('click');

        expect(setState).toBeCalledWith({
            starting: 0,
            earned: [],
            total: 0,
        });
    });
});