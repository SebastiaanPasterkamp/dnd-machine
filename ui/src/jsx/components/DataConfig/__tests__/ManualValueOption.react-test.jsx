import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import { ManualValueOption } from '..';
import uuidv4 from '../utils/uuidv4';
jest.mock('../utils/uuidv4');

const mockedId = '1';
const mockedUUID1 = 'mocked-uuid-1';

describe('Component: ManualValueOption', () => {
    const fullProps = {
        type: 'manual',
        uuid: mockedUUID1,
        path: 'some.path',
        suggestions: [ "some", "suggestions" ],
        name: 'My Label',
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
                <ManualValueOption
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <ManualValueOption
                    {...fullProps}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })
    });

    it('should emit changes in the label', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <ManualValueOption
                setState={setState}
            />
        );

        wrapper.find('input[type="text"]').at(1).simulate('change', {
            target: { value: fullProps.name }
        });

        expect(setState).toBeCalledWith({
            type: 'manual',
            uuid: mockedUUID1,
            name: fullProps.name,
        });
    });

    describe('when adding a suggestion', () => {
        let wrapper, setState;

        beforeEach(() => {
            setState = jest.fn();
            wrapper = mount(
                <ManualValueOption
                    setState={setState}
                />
            );
        });

        it('should emit strings', () => {
            wrapper.find('input[type="text"]').at(2).simulate('change', {
                target: { value: "foo" }
            });

            expect(setState).toBeCalledWith({
                type: 'manual',
                uuid: mockedUUID1,
                suggestions: ["foo"],
            });
        });
    });
});
