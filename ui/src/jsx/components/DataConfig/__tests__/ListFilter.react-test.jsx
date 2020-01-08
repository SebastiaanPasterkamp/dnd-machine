import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import ListFilter from '../components/ListFilter';

describe('Component: ListFilter', () => {
    const fullProps = {
        filter: {
            'or': [
                { 'foo': true },
                { 'bar': false },
            ],
            'foo': true,
            'bar': ['x', 'y'],
            'ruh_formula': 'some.path',
        },
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

            expect(setState).toBeCalledWith({
                'or': [],
            });
        });

        it('should emit a boolean', () => {
            wrapper.find('div[name="add"] button').simulate('click');
            wrapper.find('li[data-value="boolean"]').simulate('click');

            expect(setState).toBeCalledWith({
                '': true,
            });
        });

        it('should emit a textfield', () => {
            wrapper.find('div[name="add"] button').simulate('click');
            wrapper.find('li[data-value="textfield"]').simulate('click');

            expect(setState).toBeCalledWith({
                '': [],
            });
        });

        it('should emit a formula', () => {
            wrapper.find('div[name="add"] button').simulate('click');
            wrapper.find('li[data-value="formula"]').simulate('click');

            expect(setState).toBeCalledWith({
                '_formula': '',
            });
        });
    });
});
