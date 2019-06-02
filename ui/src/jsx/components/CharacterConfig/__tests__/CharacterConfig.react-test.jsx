import React from 'react';
import fp from 'lodash/fp';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import { statistics } from '../../../../../tests/__mocks__';

jest.useFakeTimers();
jest.mock('../../../actions/ListDataActions.jsx');

import CharacterConfig from '../CharacterConfig.jsx';

import actions from '../actions/CharacterEditorActions.jsx';
import store from '../stores/CharacterEditorStore.jsx';
import ListDataStore from '../../../stores/ListDataStore.jsx';

const value = {
    type: 'value',
    path: 'foo.value',
    value: 'bar',
};

const dict = {
    type: 'dict',
    path: 'foo.dict',
    dict: {
        description: 'foo %(bar)s',
        bar: 'blah',
    }
};

const select = {
    type: 'select',
    list: ['statistics'],
    path: 'foo.select',
};

const list = {
    type: 'list',
    list: ['statistics'],
    path: 'foo.list',
    given: ['wisdom'],
    replace: 1,
    limit: 2,
};

const list_array = {
    type: 'list',
    items: ['foo', 'bar'],
    path: 'foo.items',
    given: ['bar'],
    limit: 1,
};

const list_object = {
    type: 'list',
    items: statistics,
    path: 'foo.items',
    given: ['bar'],
    limit: 1,
};

const config = {
    type: 'config',
    config: [
        value,
    ],
};

const choice = {
    type: 'choice',
    options: [{
        label: 'a',
        description: 'foo',
        type: 'config',
        config: [
            value,
        ],
    }, {
        label: 'b',
        type: 'config',
        config: [
            dict,
        ],
    }],
};

const multichoice = {
    type: 'multichoice',
    options: [{
        label: 'a',
        path: 'foo.value',
        description: 'foo',
        type: 'value',
        value,
    }, {
        label: 'b',
        path: 'dict',
        describe: 'bar',
        type: 'dict',
        dict,
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
            {
                statistics: statistics,
            },
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

        expect(wrapper)
            .toMatchSnapshot();
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

        expect(wrapper)
            .toMatchSnapshot();

        expect(addChange)
            .toBeCalledWith(
                value.path,
                value.value,
                'id_1',
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

        expect(wrapper)
            .toMatchSnapshot();

        expect(addChange)
            .toBeCalledWith(
                dict.path,
                dict.dict,
                'id_1',
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

        expect(wrapper)
            .toMatchSnapshot();

        expect(addChange)
            .toBeCalledWith(
                select.path,
                statistics[0].code,
                'id_1',
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

        expect(wrapper)
            .toMatchSnapshot();

        expect(addChange)
            .toBeCalledWith(
                list.path,
                {added: list.given, removed: []},
                'id_1',
                {
                    given: list.given,
                    items: statistics,
                    limit: list.limit,
                    replace: list.replace,
                    type: list.type,
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

        expect(wrapper)
            .toMatchSnapshot();

        expect(addChange)
            .toBeCalledWith(
                list_array.path,
                {added: list_array.given, removed: []},
                'id_1',
                {
                    given: list_array.given,
                    items: fp.map(
                        item => ({
                            code: item,
                            label: item,
                        })
                    )(list_array.items),
                    limit: list_array.limit,
                    type: list_array.type,
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

        expect(wrapper)
            .toMatchSnapshot();

        expect(addChange)
            .toBeCalledWith(
                list_object.path,
                {added: list_object.given, removed: []},
                'id_1',
                {
                    given: list_object.given,
                    items: statistics,
                    limit: list_object.limit,
                    type: list_object.type,
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

        expect(wrapper)
            .toMatchSnapshot();

        expect(addChange)
            .toBeCalledWith(
                config.config[0].path,
                config.config[0].value,
                'id_1',
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

        expect(wrapper)
            .toMatchSnapshot();

        expect(addChange)
            .toBeCalledWith(
                choice.options[0].config[0].path,
                choice.options[0].config[0].value,
                'id_1',
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

        expect(wrapper)
            .toMatchSnapshot();

        expect(addChange)
            .toBeCalledWith(
                multichoice.options[0].path,
                multichoice.options[0].value,
                'id_1',
                {
                    type: multichoice.options[0].type,
                    value: multichoice.options[0].value,
                },
            );
    });
});
