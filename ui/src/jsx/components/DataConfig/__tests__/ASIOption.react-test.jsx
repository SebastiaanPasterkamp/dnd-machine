import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import { ASIOption } from '..';
import uuidv4 from '../utils/uuidv4';
jest.mock('../utils/uuidv4');

const mockedUUID1 = 'mocked-uuid-1';

describe('Component: ASIOption', () => {
    const fullProps = {
        type: 'ability_score',
        uuid: mockedUUID1,
        limit: 2,
        name: 'My Label',
        description: 'Bump it up',
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
                <ASIOption
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <ASIOption
                    {...fullProps}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })
    });

    describe('when changing properties', () => {
        it('should emit changes in the label', () => {
            const setState = jest.fn();

            const wrapper = mount(
                <ASIOption
                    setState={setState}
                />
            );

            wrapper.find('input[type="text"]').simulate('change', {
                target: { value: fullProps.name }
            });

            expect(setState).toBeCalledWith({
                type: 'ability_score',
                uuid: mockedUUID1,
                name: fullProps.name,
            });
        });

        it('should emit changes in the limit', () => {
            const setState = jest.fn();

            const wrapper = mount(
                <ASIOption
                    setState={setState}
                />
            );

            wrapper.find('input[type="number"]').simulate('change', {
                target: { value: 3 }
            });

            expect(setState).toBeCalledWith({
                type: 'ability_score',
                uuid: mockedUUID1,
                limit: 3,
            });
        });
    });
});
