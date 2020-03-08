import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import ListDataActions from 'actions/ListDataActions';
import {
    mockedApi,
} from '../../../../../tests/__mocks__';

import { MultichoiceOption } from '..';
import uuidv4 from '../utils/uuidv4';
jest.mock('../utils/uuidv4');

const mockedUUID1 = 'mocked-uuid-1';
const mockedUUID2 = 'mocked-uuid-2';

describe('Component: MultichoiceOption', () => {
    const fullProps = {
        type: 'multichoice',
        uuid: mockedUUID1,
        add: 2,
        replace: 1,
        options: [
            {
                type: 'value',
                uuid: mockedUUID2,
                path: 'some.path',
                value: 'some value',
                name: 'My Label',
            },
        ],
        name: 'Some choice',
        description: 'Choice _desc_',
    };

    beforeAll(() => {
        fetch.mockImplementation(mockedApi({
            options: [{
                id: 1,
                name: "Example include",
                options: [],
                type: "multichoice",
            }],
        }));
        ListDataActions.fetchItems('options', 'data');
    });

    afterAll(() => fetch.resetMocks());

    beforeEach(() => {
        uuidv4.mockImplementation(
            jest.fn().mockReturnValueOnce(mockedUUID1)
        );
    });

    describe('when rendering', () => {
        const setState = jest.fn();

        it('should work with minimum props', () => {
            const tree = renderer.create(
                <MultichoiceOption
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <MultichoiceOption
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
            <MultichoiceOption
                setState={setState}
            />
        );

        wrapper.find('input[placeholder="Label..."]').simulate('change', {
            target: { value: fullProps.name }
        });

        expect(setState).toBeCalledWith({
            type: 'multichoice',
            uuid: mockedUUID1,
            name: fullProps.name,
        });
    });

    it('should emit changes in the child component', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <MultichoiceOption
                {...fullProps}
                setState={setState}
            />
        );

        wrapper.find('input[type="text"]').at(1).simulate('change', {
            target: { value: 'other.path' }
        });

        expect(setState).toBeCalledWith({
            type: 'multichoice',
            uuid: mockedUUID1,
            options: [
                {...fullProps.options[0], path: 'other.path' }
            ],
        });
    });
});
