import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { DefinitionListComponent } from '..';

describe('Component: DefinitionListComponent', () => {
    it('should render with minimum props', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <DefinitionListComponent
                list={ {} }
                setState={ setState }
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('show some items', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <DefinitionListComponent
                list={ {
                    foo: 'bar',
                    hello: '*mark* _down_',
                } }
                setState={ setState }
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('allow deletion', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <DefinitionListComponent
                list={ {
                    foo: 'bar',
                    hello: '*mark* _down_',
                } }
                setState={ setState }
            />
        );

        wrapper
            .find('button.list-component__delete')
            .at(0)
            .simulate('click');

        expect(setState)
            .toBeCalledWith({
                hello: '*mark* _down_',
            }, null);
    });

    it('allow changes in keys', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <DefinitionListComponent
                list={ {
                    foo: 'bar',
                    hello: '*mark* _down_',
                } }
                setState={ setState }
            />
        );

        wrapper
            .find('input')
            .at(0)
            .simulate('change', {target: {value: 'food'}});

        expect(setState)
            .toBeCalledWith({
                food: 'bar',
                hello: '*mark* _down_',
            }, null);
    });

    it('allow changes in values', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <DefinitionListComponent
                list={ {
                    foo: 'bar',
                    hello: '*mark* _down_',
                } }
                setState={ setState }
            />
        );

        wrapper
            .find('textarea')
            .at(0)
            .simulate('change', {target: {value: 'bars'}});

        expect(setState)
            .toBeCalledWith({
                foo: 'bars',
                hello: '*mark* _down_',
            }, null);
    });

    it('allow adding keys', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <DefinitionListComponent
                list={ {
                    foo: 'bar',
                    hello: '*mark* _down_',
                } }
                setState={ setState }
            />
        );

        wrapper
            .find('input')
            .at(2)
            .simulate('change', {target: {value: 'test'}});

        expect(setState)
            .toBeCalledWith({
                foo: 'bar',
                hello: '*mark* _down_',
                test: undefined,
            }, null);
    });

    it('allow adding descriptions', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <DefinitionListComponent
                list={ {
                    foo: 'bar',
                    hello: '*mark* _down_',
                } }
                setState={ setState }
            />
        );

        wrapper
            .find('textarea')
            .at(2)
            .simulate('change', {target: {value: 'test'}});

        expect(setState)
            .toBeCalledWith({
                foo: 'bar',
                hello: '*mark* _down_',
                'undefined': 'test',
            }, null);
    });
});
