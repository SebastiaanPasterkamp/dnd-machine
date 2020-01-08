import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import uuidv4 from '../utils/uuidv4';
jest.mock('../utils/uuidv4');

import ListDataActions from 'actions/ListDataActions';
import {
    mockedApi,
} from '../../../../../tests/__mocks__';

import { ChoiceOption } from '..';

const mockedUUID1 = 'mocked-uuid-1';
const mockedUUID2= 'mocked-uuid-2';

describe('Component: ChoiceOption', () => {
    const fullProps = {
        type: 'choice',
        uuid: mockedUUID1,
        options: [
            {
                type: 'value',
                uuid: mockedUUID2,
                path: 'some.path',
                value: 'some value',
                label: 'My Label',
            },
        ],
        label: 'Some choice',
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
            jest.fn()
                .mockReturnValueOnce(mockedUUID1)
                .mockReturnValueOnce(mockedUUID2)
      );
    });

    describe('when rendering', () => {
        const setState = jest.fn();

        it('should work with minimum props', () => {
            const tree = renderer.create(
                <ChoiceOption
                    uuid={mockedUUID1}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <ChoiceOption
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
            <ChoiceOption
                setState={setState}
            />
        );

        wrapper.find('input[type="text"]').simulate('change', {
            target: { value: fullProps.label }
        });

        expect(setState).toBeCalledWith({
            type: 'choice',
            uuid: mockedUUID1,
            label: fullProps.label,
        });
    });

    it('should emit changes in the child component', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <ChoiceOption
                {...fullProps}
                setState={setState}
            />
        );

        wrapper.find('input[type="text"]').at(1).simulate('change', {
            target: { value: 'other.path' }
        });

        expect(setState).toBeCalledWith({
            type: 'choice',
            uuid: mockedUUID1,
            options: [
                {...fullProps.options[0], path: 'other.path' }
            ],
        });
    });

    it('should add an option with unique ids', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <ChoiceOption
                setState={setState}
            />
        );

        wrapper.find('div[name="add"] button').simulate('click');
        wrapper.find('li[data-value="value"]').simulate('click');

        expect(setState).toBeCalledWith({
            type: 'choice',
            uuid: mockedUUID1,
            options: [{
                type: 'value',
            }],
        });
    });
});
