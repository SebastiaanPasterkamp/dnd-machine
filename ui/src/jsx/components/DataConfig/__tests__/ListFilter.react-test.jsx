import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import ListFilter from '../components/ListFilter';

describe('Component: ListFilter', () => {
    const fullProps = {
        filter: [
            {
                type: 'or',
                method: 'or',
                filters: [
                    {
                        type: "boolean",
                        method: "absolute",
                        field: "foo",
                        condition: true,
                    },
                    {
                        type: "boolean",
                        method: "absolute",
                        field: "bar",
                        condition: false,
                    },
                ],
            },
            {
                type: 'boolean',
                method: 'absolute',
                field: 'foo',
                condition: true,
            },
            {
                type: 'textfield',
                field: 'bar',
                options: ['x', 'y']
            },
            {
                type: "formula",
                field: 'ruh',
                options: 'some.path',
            },
        ],
    };

    describe('when rendering', () => {
        const setState = jest.fn();

        it('should work with minimum props', () => {
            const tree = renderer.create(
                <ListFilter
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <ListFilter
                    {...fullProps}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })
    });

    describe('when adding filters', () => {
        let setState;
        let wrapper;

        beforeEach(() => {
            setState = jest.fn();

            wrapper = mount(
                <ListFilter
                    setState={setState}
                />
            );
        });

        it('should emit an or', () => {
            wrapper.find('div[name="add"] button').simulate('click');
            wrapper.find('li[data-value="or"]').simulate('click');

            expect(setState).toBeCalledWith([
                {
                    type: "or",
                    method: "or",
                }
            ], null);
        });

        it('should emit a boolean', () => {
            wrapper.find('div[name="add"] button').simulate('click');
            wrapper.find('li[data-value="boolean"]').simulate('click');

            expect(setState).toBeCalledWith([
                {
                    type: "boolean",
                    method: "absolute",
                    condition: false,
                }
            ], null);
        });

        it('should emit a textfield', () => {
            wrapper.find('div[name="add"] button').simulate('click');
            wrapper.find('li[data-value="textfield"]').simulate('click');

            expect(setState).toBeCalledWith([
                {
                    type: "textfield",
                }
            ], null);
        });

        it('should emit a formula', () => {
            wrapper.find('div[name="add"] button').simulate('click');
            wrapper.find('li[data-value="formula"]').simulate('click');

            expect(setState).toBeCalledWith([
                {
                    type: "formula",
                }
            ], null);
        });
    });
});
