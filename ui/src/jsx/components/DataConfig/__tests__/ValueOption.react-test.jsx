import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import { ValueOption } from '..';
import uuidv4 from '../utils/uuidv4';
jest.mock('../utils/uuidv4');

const mockedId = '1';
const mockedUUID1 = 'mocked-uuid-1';

describe('Component: ValueOption', () => {
    const fullProps = {
        type: 'value',
        uuid: mockedUUID1,
        path: 'some.path',
        value: 'Some *value*',
        label: 'My Label',
        hidden: true,
    };

    beforeEach(() => {
        fp.uniqueId = _.uniqueId = jest.fn();
        _.uniqueId
            .mockReturnValueOnce(mockedId)
            .mockReturnValueOnce('unexpected');
        uuidv4.mockImplementation(
            jest.fn().mockReturnValueOnce(mockedUUID1)
        );
    });

    afterEach(() => jest.clearAllMocks());

    describe('when rendering', () => {
        const setState = jest.fn();

        it('should work with minimum props', () => {
            const tree = renderer.create(
                <ValueOption
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <ValueOption
                    {...fullProps}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should show label/desc when not hidden', () => {
            const tree = renderer.create(
                <ValueOption
                    {...fullProps}
                    hidden={false}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should show label/desc when cannot be hidden', () => {
            const tree = renderer.create(
                <ValueOption
                    {...fullProps}
                    canBeHidden={false}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })
    });

    it('should emit changes in the label', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <ValueOption
                setState={setState}
            />
        );

        wrapper.find('input[type="text"]').at(1).simulate('change', {
            target: { value: fullProps.label }
        });

        expect(setState).toBeCalledWith({
            type: 'value',
            uuid: mockedUUID1,
            label: fullProps.label,
        });
    });

    describe('when editing the value', () => {
        let wrapper, setState;

        beforeEach(() => {
            setState = jest.fn();
            wrapper = mount(
                <ValueOption
                setState={setState}
                />
            );
        });

        it('should emit strings', () => {
            wrapper.find('textarea').simulate('change', {
                target: { value: "foo" }
            });

            expect(setState).toBeCalledWith({
                type: 'value',
                uuid: mockedUUID1,
                value: "foo",
            });
        });

        it('should emit integers', () => {
            wrapper.find('textarea').simulate('change', {
                target: { value: "1" }
            });

            expect(setState).toBeCalledWith({
                type: 'value',
                uuid: mockedUUID1,
                value: 1,
            });
        });

        it('should emit floats', () => {
            wrapper.find('textarea').simulate('change', {
                target: { value: "1.2" }
            });

            expect(setState).toBeCalledWith({
                type: 'value',
                uuid: mockedUUID1,
                value: 1.2,
            });
        });
    });
});
