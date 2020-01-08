import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import { DictOption } from '..';
import uuidv4 from '../utils/uuidv4';
jest.mock('../utils/uuidv4');

const mockedUUID1 = 'mocked-uuid-1';

describe('Component: DictOption', () => {
    const fullProps = {
        type: 'dict',
        uuid: mockedUUID1,
        path: 'some.path',
        label: 'Something given',
        dict: {
            description: "You're welcome: %(number)s",
            number: 4,
        },
    };

    beforeEach(() => {
        uuidv4.mockImplementation(
            jest.fn().mockReturnValueOnce(mockedUUID1)
        );
    });

    describe('when rendering', () => {
        const setState = jest.fn();

        it('should work with minimum props', () => {
            const tree = renderer.create(
                <DictOption
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <DictOption
                    {...fullProps}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })
    });

    describe('when updating sub-components', () => {
        it('should emit changes in the path', () => {
            const setState = jest.fn();

            const wrapper = mount(
                <DictOption
                    setState={setState}
                />
            );

            wrapper.find('input[type="text"]').at(0).simulate('change', {
                target: { value: fullProps.path }
            });

            expect(setState).toBeCalledWith({
                type: 'dict',
                uuid: mockedUUID1,
                path: fullProps.path,
            });
        });

        it('should emit changes in the label', () => {
            const setState = jest.fn();

            const wrapper = mount(
                <DictOption
                    setState={setState}
                />
            );

            wrapper.find('input[type="text"]').at(1).simulate('change', {
                target: { value: fullProps.label }
            });

            expect(setState).toBeCalledWith({
                type: 'dict',
                uuid: mockedUUID1,
                label: fullProps.label,
            });
        });

        it('should emit new fields in the dict', () => {
            const setState = jest.fn();

            const wrapper = mount(
                <DictOption
                    {...fullProps}
                    setState={setState}
                />
            );

            wrapper.find('div[name="add"] button').simulate('click');
            wrapper.find('li[data-value="text"]').simulate('click');

            expect(setState).toBeCalledWith({
                type: 'dict',
                uuid: mockedUUID1,
                dict: {
                    ...fullProps.dict,
                    '': '',
                },
            });
        });

        it('should emit changes to the field', () => {
            const setState = jest.fn();

            const wrapper = mount(
                <DictOption
                    {...fullProps}
                    setState={setState}
                />
            );

            wrapper.find('input[type="text"]').at(3).simulate('change', {
                target: { value: 'numeric' }
            });

            expect(setState).toBeCalledWith({
                type: 'dict',
                uuid: mockedUUID1,
                dict: {
                    ...fullProps.dict,
                    number: undefined,
                    numeric: 4,
                },
            });
        });

        it('should emit changes to the value', () => {
            const setState = jest.fn();

            const wrapper = mount(
                <DictOption
                    {...fullProps}
                    setState={setState}
                />
            );

            wrapper.find('input[type="number"]').simulate('change', {
                target: { value: 5 }
            });

            expect(setState).toBeCalledWith({
                type: 'dict',
                uuid: mockedUUID1,
                dict: {
                    ...fullProps.dict,
                    number: 5,
                },
            });
        });

        it('should emit formula attributes', () => {
            const setState = jest.fn();

            const wrapper = mount(
                <DictOption
                    {...fullProps}
                    setState={setState}
                />
            );

            wrapper.find('div[name="add"] button').simulate('click');
            wrapper.find('li[data-value="formula"]').simulate('click');

            expect(setState).toBeCalledWith({
                type: 'dict',
                uuid: mockedUUID1,
                dict: {
                    ...fullProps.dict,
                    _formula: '',
                    _default: '',
                },
            });
        });

        it('should emit formula attributes', () => {
            const setState = jest.fn();

            const wrapper = mount(
                <DictOption
                    {...fullProps}
                    dict={{
                        _formula: '',
                        _default: '',
                    }}
                    setState={setState}
                />
            );

            wrapper.find('input[type="text"]').at(2).simulate('change', {
                target: { value: 'field' }
            });

            expect(setState).toBeCalledWith({
                type: 'dict',
                uuid: mockedUUID1,
                dict: {
                    field_formula: '',
                    field_default: '',
                },
            });
        });
    });
});
