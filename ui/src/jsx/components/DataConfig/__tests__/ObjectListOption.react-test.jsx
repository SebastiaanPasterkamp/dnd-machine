import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import ListDataActions from 'actions/ListDataActions';
import {
    mockedApi,
    armor_types,
} from '../../../../../tests/__mocks__';

import { ObjectListOption } from '..';
import uuidv4 from '../utils/uuidv4';
jest.mock('../utils/uuidv4');

const mockedId1 = '1';
const mockedId2 = '2';
const mockedUUID1 = 'mocked-uuid-1';

describe('Component: ObjectListOption', () => {
    const fullProps = {
        type: 'objectlist',
        uuid: mockedUUID1,
        path: 'some.path',
        given: [
            {id: "light", name: "Light Armor", type: "armor_types"},
        ],
        name: 'Something given',
        description: "You're welcome",
        multiple: true,
        hidden: true,
    };

    const listProps = {
        type: 'objectlist',
        uuid: mockedUUID1,
        path: 'proficiencies.armor',
        list: ['armor_types'],
        filter: [
            {
                type: 'textfield',
                field: 'type',
                options: ['shield'],
            }
        ],
        add: 1,
        given: [],
        name: 'Some armor',
        description: "You're welcome",
    };

    beforeAll(() => {
        fetch.mockImplementation(mockedApi({
            armor_types,
        }));
        ListDataActions.fetchItems('armor_types');
    });

    afterAll(() => fetch.resetMocks());

    beforeEach(() => {
        fp.uniqueId = _.uniqueId = jest.fn();
        _.uniqueId
            .mockReturnValueOnce(mockedId1)
            .mockReturnValueOnce(mockedId2)
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
                <ObjectListOption
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should work with full props', () => {
            const tree = renderer.create(
                <ObjectListOption
                    {...fullProps}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should show label/desc when not hidden', () => {
            const tree = renderer.create(
                <ObjectListOption
                    {...fullProps}
                    hidden={false}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should show label/desc when cannot be hidden', () => {
            const tree = renderer.create(
                <ObjectListOption
                    {...fullProps}
                    canBeHidden={false}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('should show more options with a list', () => {
            const tree = renderer.create(
                <ObjectListOption
                    {...listProps}
                    setState={setState}
                />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        })
    });

    it('should emit changes in the label', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <ObjectListOption
                setState={setState}
            />
        );

        wrapper.find('input[type="text"]').at(1).simulate('change', {
            target: { value: fullProps.name }
        });

        expect(setState).toBeCalledWith({
            type: 'objectlist',
            uuid: mockedUUID1,
            name: fullProps.name,
        });
    });

    it('should add items to the list types', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <ObjectListOption
                setState={setState}
            />
        );

        wrapper.find('.base-tag-container button').simulate('click');
        wrapper.find('li[data-value="armor_types"]').simulate('click');

        expect(setState).toBeCalledWith({
            type: 'objectlist',
            uuid: mockedUUID1,
            list: ['armor_types'],
        });
    });

    it('should emit list filters when added', () => {
        const setState = jest.fn();

        const wrapper = mount(
            <ObjectListOption
                list={['armor_types']}
                add={1}
                setState={setState}
            />
        );

        wrapper.find('div[name="add"] button').simulate('click');
        wrapper.find('li[data-value="boolean"]').simulate('click');

        expect(setState).toBeCalledWith({
            type: 'objectlist',
            uuid: mockedUUID1,
            filter: [
                {
                    type: 'boolean',
                    method: 'absolute',
                    condition: false,
                }
            ],
        });
    });

    describe('when editing fields that accept formulas', () => {
        let setState, wrapper;

        beforeEach(() => {
            setState = jest.fn();

            wrapper = mount(
                <ObjectListOption
                    list={['armor_types']}
                    setState={setState}
                />
            );
        });

        it('should emit a _formula field', () => {
            wrapper.find('input').at(4).simulate('change', {
                target: { value: "spells.max_cantrips" }
            });

            expect(setState).toBeCalledWith({
                type: 'objectlist',
                uuid: mockedUUID1,
                limit: undefined,
                limit_formula: "spells.max_cantrips",
            });
        });

        it('should convert numeric values without _formula', () => {
            wrapper.find('input').at(4).simulate('change', {
                target: { value: "4" }
            });

            expect(setState).toBeCalledWith({
                type: 'objectlist',
                uuid: mockedUUID1,
                limit: 4,
                limit_formula: undefined,
            });
        });

        it('should blank the fields when the value is removed', () => {
            wrapper.find('input').at(4).simulate('change', {
                target: { value: "" }
            });

            expect(setState).toBeCalledWith({
                type: 'objectlist',
                uuid: mockedUUID1,
                limit: undefined,
                limit_formula: undefined,
            });
        });
    });
});
