import React from 'react';
import { mount } from 'enzyme';

import TabComponent from '..';

describe('Component: TabComponent', () => {
    const fullProps = {
        tabConfig: [
            { label: 'Foo', icon: 'pencil' },
            { label: 'Bar', icon: 'help', active: true },
            { label: 'Ruh', icon: 'cross', disabled: true },
        ],
        activeTab: 0,
        mountAll: true,
    };

    it('should render with minimum props', () => {
        const wrapper = mount(
            <TabComponent
                tabConfig={fullProps.tabConfig}
            >
                <span>Foo</span>
                <span>Bar</span>
                <span>Ruh</span>
            </TabComponent>
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render with all props', () => {
        const onTabChange = jest.fn();
        const wrapper = mount(
            <TabComponent
                onTabChange={onTabChange}
                {...fullProps}
            >
                <span>Foo</span>
                <span>Bar</span>
                <span>Ruh</span>
            </TabComponent>
        );

        expect(wrapper).toMatchSnapshot();
        expect(onTabChange).not.toBeCalled();
    });

    it('should emit the first/active tab if nothing is selected yet', () => {
        const onTabChange = jest.fn();
        const wrapper = mount(
            <TabComponent
                onTabChange={onTabChange}
                {...fullProps}
                activeTab={undefined}
            >
                <span>Foo</span>
                <span>Bar</span>
                <span>Ruh</span>
            </TabComponent>
        );

        expect(onTabChange).toBeCalledWith(1);
    });

    it('should emit changes while switching tabs', () => {
        const onTabChange = jest.fn();
        const wrapper = mount(
            <TabComponent
                onTabChange={onTabChange}
                {...fullProps}
            >
                <span>Foo</span>
                <span>Bar</span>
                <span>Ruh</span>
            </TabComponent>
        );

        wrapper
            .find('.tab-component__tab a')
            .at(1)
            .simulate('click');

        expect(onTabChange).toBeCalledWith(1);

        wrapper
            .find('.tab-component__tab a')
            .at(0)
            .simulate('click');

        expect(onTabChange).toBeCalledWith(0);
    });
});
