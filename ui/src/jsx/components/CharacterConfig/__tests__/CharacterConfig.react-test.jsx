import React from 'react';
import fp from 'lodash/fp';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import { statistics } from '../../../../../tests/__mocks__';

jest.useFakeTimers();
jest.mock('../../../actions/ListDataActions');

import CharacterConfig from '..';

import actions from '../actions/CharacterEditorActions';
import store from '../stores/CharacterEditorStore';
import ListDataStore from '../../../stores/ListDataStore';

const value = {
    type: 'value',
    uuid: 'mocked-uuid-1',
    path: 'foo.value',
    value: 'bar',
};

const dict = {
    type: 'dict',
    uuid: 'mocked-uuid-2',
    path: 'foo.dict',
    dict: {
        description: 'foo %(bar)s',
        bar: 'blah',
    }
};

const select = {
    type: 'select',
    uuid: 'mocked-uuid-2',
    list: ['statistics'],
    path: 'foo.select',
};

const list = {
    type: 'list',
    uuid: 'mocked-uuid-4',
    list: ['statistics'],
    path: 'foo.list',
    given: ['wisdom'],
    replace: 1,
    add: 2,
};

const list_array = {
    type: 'list',
    uuid: 'mocked-uuid-5',
    items: ['foo', 'bar'],
    path: 'foo.items',
    given: ['bar'],
    add: 1,
};

const list_object = {
    type: 'list',
    uuid: 'mocked-uuid-6',
    items: statistics,
    path: 'foo.items',
    given: ['bar'],
    add: 1,
};

const config = {
    type: 'config',
    uuid: 'mocked-uuid-7',
    config: [
        value,
    ],
};

const choice = {
    type: 'choice',
    uuid: 'mocked-uuid-8',
    options: [{
        type: 'config',
        uuid: 'mocked-uuid-9',
        label: 'a',
        description: 'foo',
        config: [
            value,
        ],
    }, {
        type: 'config',
        uuid: 'mocked-uuid-10',
        label: 'b',
        config: [
            dict,
        ],
    }],
};

const multichoice = {
    type: 'multichoice',
    uuid: 'mocked-uuid-11',
    options: [{
        ...value,
        label: 'a',
        uuid: 'mocked-uuid-12',
        description: 'foo',
    }, {
        ...dict,
        uuid: 'mocked-uuid-13',
        label: 'b',
        describe: 'bar',
    }],
};

describe('Component: CharacterConfig', () => {
    var mockedId = 1;

    beforeEach(() => {
        mockedId = 1;

        fp.uniqueId = jest.fn();
        fp.uniqueId.mockReturnValue('id_' + mockedId++);

        actions.editCharacter.completed({
            foo: {
                value: 'foo',
                select: 'strength',
                list: ['charisma'],
                dict: {
                    description: 'foo.dict goes here',
                },
            },
        });

        ListDataStore.onFetchItemsCompleted(
            { statistics },
            'statistics'
        );

        jest.runAllTimers();
    });

    afterEach(() => store.reset());

    it('should not render anything', () => {
        const wrapper = mount(
            <CharacterConfig
                config={[]}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render value', () => {
        const addChange = jest.spyOn(
            actions,
            'addChange'
        );

        const wrapper = mount(
            <CharacterConfig
                config={[
                    value,
                ]}
            />
        );

        expect(wrapper).toMatchSnapshot();

        expect(addChange).toBeCalledWith(
            value.uuid,
            value.path,
            value.value,
            {
                type: value.type,
                value: value.value,
            },
        );
    });

    it('should render dict', () => {
        const addChange = jest.spyOn(
            actions,
            'addChange'
        );

        const wrapper = mount(
            <CharacterConfig
                config={[
                    dict,
                ]}
            />
        );

        expect(wrapper).toMatchSnapshot();

        expect(addChange).toBeCalledWith(
            dict.uuid,
            dict.path,
            dict.dict,
            {
                type: dict.type,
                dict: dict.dict,
            },
        );
    });

    it('should render select', () => {
        const addChange = jest.spyOn(
            actions,
            'addChange'
        );

        const wrapper = mount(
            <CharacterConfig
                config={[
                    select,
                ]}
            />
        );

        expect(wrapper).toMatchSnapshot();

        expect(addChange).toBeCalledWith(
            select.uuid,
            select.path,
            statistics[0].code,
            {
                items: statistics,
                type: select.type,
            },
        );
    });

    it('should render list', () => {
        const addChange = jest.spyOn(
            actions,
            'addChange'
        );

        const wrapper = mount(
            <CharacterConfig
                config={[
                    list,
                ]}
            />
        );

        expect(wrapper).toMatchSnapshot();

        expect(addChange).toBeCalledWith(
                list.uuid,
                list.path,
                {
                    added: list.given,
                    removed: [],
                },
                {
                    type: list.type,
                    given: list.given,
                    items: statistics,
                    add: list.add,
                    replace: list.replace,
                },
            );
    });

    it('should render with array items', () => {
        const addChange = jest.spyOn(
            actions,
            'addChange'
        );

        const wrapper = mount(
            <CharacterConfig
                config={[
                    list_array,
                ]}
            />
        );

        expect(wrapper).toMatchSnapshot();

        expect(addChange).toBeCalledWith(
            list_array.uuid,
            list_array.path,
            {
                added: list_array.given,
                removed: [],
            },
            {
                type: list_array.type,
                given: list_array.given,
                items: fp.map(
                    item => ({
                        code: item,
                        label: item,
                    })
                )(list_array.items),
                add: list_array.add,
            },
        );
    });

    it('should render with object items', () => {
        const addChange = jest.spyOn(
            actions,
            'addChange'
        );

        const wrapper = mount(
            <CharacterConfig
                config={[
                    list_object,
                ]}
            />
        );

        expect(wrapper).toMatchSnapshot();

        expect(addChange).toBeCalledWith(
            list_object.uuid,
            list_object.path,
            {added: list_object.given, removed: []},
            {
                type: list_object.type,
                given: list_object.given,
                items: statistics,
                add: list_object.add,
            },
        );
    });

    it('should render config', () => {
        const addChange = jest.spyOn(
            actions,
            'addChange'
        );

        const wrapper = mount(
            <CharacterConfig
                config={[
                    config,
                ]}
            />
        );

        expect(wrapper).toMatchSnapshot();

        expect(addChange).toBeCalledWith(
            config.config[0].uuid,
            config.config[0].path,
            config.config[0].value,
            {
                type: config.config[0].type,
                value: config.config[0].value,
            },
        );
    });

    it('should render choice', () => {
        const addChange = jest.spyOn(
            actions,
            'addChange'
        );

        const wrapper = mount(
            <CharacterConfig
                config={[
                    choice,
                ]}
            />
        );

        expect(wrapper).toMatchSnapshot();

        expect(addChange).toBeCalledWith(
            choice.options[0].config[0].uuid,
            choice.options[0].config[0].path,
            choice.options[0].config[0].value,
            {
                type: choice.options[0].config[0].type,
                value: choice.options[0].config[0].value,
            },
        );
    });

    it('should render multichoice', () => {
        const addChange = jest.spyOn(
            actions,
            'addChange'
        );

        const wrapper = mount(
            <CharacterConfig
                config={[
                    multichoice,
                ]}
            />
        );

        expect(wrapper).toMatchSnapshot();

        expect(addChange).toBeCalledWith(
            multichoice.options[0].uuid,
            multichoice.options[0].path,
            multichoice.options[0].value,
            {
                type: multichoice.options[0].type,
                value: multichoice.options[0].value,
            },
        );
    });
});
