import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import { ConfigOption } from '..';
import uuidv4 from '../utils/uuidv4';
jest.mock('../utils/uuidv4');

const mockedId1 = '1';
const mockedId2 = '1';
const mockedUUID1 = 'mocked-uuid-1';
const mockedUUID2 = 'mocked-uuid-2';

describe('Component: ConfigOption', () => {
    const fullProps = {
        type: 'config',
        uuid: mockedUUID1,
        config: [
            {
                type: 'value',
                uuid: mockedUUID2,
                path: 'some.path',
                value: 'some value',
                name: 'My Label',
                hidden: true,
            },
        ],
        name: 'Some config',
        description: 'Config _desc_',
        hidden: true,
    };

    beforeEach(() => {
        fp.uniqueId = _.uniqueId = jest.fn();
        _.uniqueId
            .mockReturnValueOnce(mockedId1)
            .mockReturnValueOnce(mockedId2)
            .mockReturnValueOnce('unexpected');
        uuidv4.mockImplementation(
            jest.fn()
                .mockReturnValueOnce(mockedUUID1)
                .mockReturnValueOnce(mockedUUID2)
        );
    });

    afterEach(() => jest.clearAllMocks());

    describe('when rendering', () => {
        const setState = jest.fn();

        it('should work with minimum props', () => {
            const tree = renderer.create(
                <ConfigOption
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <ConfigOption
                    {...fullProps}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should show label/desc when not hidden', () => {
            const tree = renderer.create(
                <ConfigOption
                    {...fullProps}
                    hidden={false}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should show label/desc when cannot be hidden', () => {
            const tree = renderer.create(
                <ConfigOption
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
            <ConfigOption
                setState={setState}
            />
        );

        wrapper.find('input[placeholder="Label..."]').simulate('change', {
            target: { value: fullProps.name }
        });

        expect(setState).toBeCalledWith({
            type: 'config',
            uuid: mockedUUID1,
            name: fullProps.name,
        });
    });

    it('should emit changes in the child component', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <ConfigOption
                {...fullProps}
                setState={setState}
            />
        );

        wrapper.find('input[type="text"]').at(0).simulate('change', {
            target: { value: 'other.path' }
        });

        expect(setState).toBeCalledWith({
            type: 'config',
            uuid: mockedUUID1,
            config: [
                {...fullProps.config[0], path: 'other.path' }
            ],
        });
    });
});
