import React from 'react';
import CharacterConfig from 'components/Character/CharacterConfig.jsx';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

const api = require('../../__mocks__/apiCalls.js');
const current = {
    'foo.value': 'foo',
    'foo.select': 'strength',
    'foo.list': ['charisma'],
};

const props = {
    index: [],
    getCurrent: jest.fn((path) => current[path]),
    getItems: jest.fn((list) => api[list]),
};

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
    list: 'statistics',
    path: 'foo.select',
};

const list = {
    type: 'list',
    list: 'statistics',
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
    items: api.statistics,
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
        description: 'foo',
        options: [
            value,
        ],
    }, {
        label: 'b',
        options: [
            dict,
        ],
    }],
};

describe('Component: CharacterConfig', () => {
    it('should not render anything', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <CharacterConfig
                onChange={onChange}
                config={[]}
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();
    });

    it('should render value', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <CharacterConfig
                onChange={onChange}
                config={[
                    value,
                ]}
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();

        expect(onChange)
            .toBeCalledWith(
                'foo.value',
                'bar',
                [0],
                value,
            );
    });

    it('should render dict', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <CharacterConfig
                onChange={onChange}
                config={[
                    dict,
                ]}
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();

        expect(onChange)
            .toBeCalledWith(
                'foo.dict',
                dict.dict,
                [0],
                dict,
            );
    });

    it('should render select', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <CharacterConfig
                onChange={onChange}
                config={[
                    select,
                ]}
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();

        expect(onChange)
            .toBeCalledWith(
                'foo.select',
                'strength',
                [0],
                select,
            );
    });

    it('should render list', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <CharacterConfig
                onChange={onChange}
                config={[
                    list,
                ]}
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();

        expect(onChange)
            .toBeCalledWith(
                'foo.list',
                {added: ['wisdom'], removed: []},
                [0],
                list,
            );
    });

    it('should render with array items', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <CharacterConfig
                onChange={onChange}
                config={[
                    list_array,
                ]}
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();

        expect(onChange)
            .toBeCalledWith(
                'foo.items',
                {added: ['bar'], removed: []},
                [0],
                list_array,
            );
    });

    it('should render with object items', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <CharacterConfig
                onChange={onChange}
                config={[
                    list_object,
                ]}
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();

        expect(onChange)
            .toBeCalledWith(
                'foo.items',
                {added: ['bar'], removed: []},
                [0],
                list_object,
            );
    });

    it('should render config', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <CharacterConfig
                onChange={onChange}
                config={[
                    config,
                ]}
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();

        expect(onChange)
            .toBeCalledWith(
                'foo.value',
                'bar',
                [0, 0],
                value,
            );
    });

    it('should render choice', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <CharacterConfig
                onChange={onChange}
                config={[
                    choice,
                ]}
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();

        expect(onChange)
            .toBeCalledWith(
                'foo.value',
                'bar',
                [0, 0, 0, 0],
                value,
            );
    });

    it('should render multichoice', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <CharacterConfig
                onChange={onChange}
                config={[
                    multichoice,
                ]}
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();

        expect(onChange)
            .not.toBeCalled();
    });
});
