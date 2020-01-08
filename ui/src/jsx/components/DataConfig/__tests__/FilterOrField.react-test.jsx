import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import FilterOrField from '../components/FilterOrField';

describe('Component: FilterOrField', () => {
    const fullProps = {
        field: 'or',
        filter: [
            { 'foo': false },
            { 'bar': true },
        ],
    };

    describe('when rendering', () => {
        const setState = jest.fn();

        it('should work with minimum props', () => {
            const tree = renderer.create(
                <FilterOrField
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <FilterOrField
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
                <FilterOrField
                    setState={setState}
                />
            );
        });

        it('should emit an new filter', () => {
            wrapper.find('div[name="add"] button').simulate('click');
            wrapper.find('li[data-value="boolean"]').simulate('click');

            expect(setState).toBeCalledWith({
                'field': "or",
                'filter': [
                    {'': true},
                ]
            });
        });
    });
});
