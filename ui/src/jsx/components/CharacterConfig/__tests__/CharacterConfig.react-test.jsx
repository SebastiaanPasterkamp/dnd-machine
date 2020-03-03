import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import {
    map,
    cloneDeep,
} from 'lodash/fp';

import { statistics } from '../../../../../tests/__mocks__';

jest.useFakeTimers();

import CharacterConfig from '..';

import actions from '../actions/CharacterEditorActions';
import store from '../stores/CharacterEditorStore';
import ListDataStore from '../../../stores/ListDataStore';

import {
    value,
    dict,
    select,
    list,
    list_array,
    list_object,
    config,
    choice,
    multichoice,
} from './__mocks__/example_configs';

describe('Component: CharacterConfig', () => {
    const props = {
        type: 'config',
        uuid: 'mocked-uuid-1',
    };
    const original = {
        foo: {
            value: 'foo',
            select: 'strength',
            list: ['charisma'],
            dict: {
                description: 'foo.dict goes here',
            },
        },
    };

    const injectLevelUp = function(options) {
        const levelUp = [ options ];
        store.onEditCharacterCompleted({
            ...cloneDeep(original),
            level_up: { config: levelUp },
        });
        return levelUp;
    };

    let addChoice;

    beforeEach(() => {
        ListDataStore.onFetchItemsCompleted(
            { statistics },
            'statistics'
        );
        addChoice = jest.spyOn(actions, 'addChoice');
    });

    afterEach(() => {
        store.reset();
        addChoice.mockClear();
        jest.runAllTimers();
    });

    it('should not render anything', () => {
        const wrapper = mount(
            <CharacterConfig
                {...props}
                config={[]}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(addChoice).not.toBeCalled();
    });

    it('should render value', () => {
        const levelUp = injectLevelUp(value);

        const wrapper = mount(
            <CharacterConfig
                {...props}
                config={levelUp}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(addChoice).not.toBeCalled();
    });

    it('should render dict', () => {
        const levelUp = injectLevelUp(dict);

        const wrapper = mount(
            <CharacterConfig
                {...props}
                config={levelUp}
            />
        );

        expect(wrapper).toMatchSnapshot();

        expect(addChoice).not.toBeCalled();
    });

    it('should render select', () => {
        const levelUp = injectLevelUp(select);

        const wrapper = mount(
            <CharacterConfig
                {...props}
                config={levelUp}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(addChoice).not.toBeCalled();

        wrapper.find('button').simulate('click');
        wrapper.find({'data-value': "wisdom"}).simulate('click');

        expect(addChoice).toBeCalledWith(
            select.uuid,
            select.path,
            { current: "wisdom" },
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should render list', () => {
        const levelUp = injectLevelUp(list);

        const wrapper = mount(
            <CharacterConfig
                {...props}
                config={levelUp}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(addChoice).not.toBeCalled();

        wrapper.find('button.nice-btn').simulate('click');
        wrapper.find({'data-value': "intelligence"}).simulate('click');

        expect(addChoice).toBeCalledWith(
            list.uuid,
            list.path,
            { added: ["intelligence"], removed: [] },
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with array items', () => {
        const levelUp = injectLevelUp(list_array);

        const wrapper = mount(
            <CharacterConfig
                {...props}
                config={levelUp}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(addChoice).not.toBeCalled();

        wrapper.find('button.nice-btn').simulate('click');
        wrapper.find({'data-value': "foo"}).simulate('click');

        expect(addChoice).toBeCalledWith(
            list_array.uuid,
            list_array.path,
            { added: ["foo"], removed: [] },
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with object items', () => {
        const levelUp = injectLevelUp(list_object);

        const wrapper = mount(
            <CharacterConfig
                {...props}
                config={levelUp}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(addChoice).not.toBeCalled();

        wrapper.find('button.nice-btn').simulate('click');
        wrapper.find({'data-value': "intelligence"}).simulate('click');

        expect(addChoice).toBeCalledWith(
            list_object.uuid,
            list_object.path,
            {
                added: [
                    {
                        type: "statistics",
                        id: "intelligence",
                        name: "Intelligence",
                        description: "Int",
                    },
                ],
                removed: [
                ],
            },
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should render config', () => {
        const levelUp = injectLevelUp(config);

        const wrapper = mount(
            <CharacterConfig
                {...props}
                config={levelUp}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(addChoice).not.toBeCalled();
    });

    it('should render choice', () => {
        const levelUp = injectLevelUp(choice);

        const wrapper = mount(
            <CharacterConfig
                {...props}
                config={levelUp}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(addChoice).toBeCalledWith(
            choice.uuid,
            undefined,
            { selected: choice.options[0].uuid },
        );

        wrapper.find('.tab-component__tab a').at(1).simulate('click');

        expect(addChoice).toBeCalledWith(
            choice.uuid,
            undefined,
            { selected: choice.options[1].uuid },
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should render multichoice', () => {
        const levelUp = injectLevelUp(multichoice);

        const wrapper = mount(
            <CharacterConfig
                {...props}
                config={levelUp}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(addChoice).not.toBeCalled();

        wrapper.find('button').simulate('click');
        wrapper.find({'data-value': multichoice.options[0].uuid}).simulate('click');

        expect(addChoice).toBeCalledWith(
            multichoice.uuid,
            undefined,
            { added: [multichoice.options[0].uuid], removed: [] },
        );
        expect(wrapper).toMatchSnapshot();
    });
});
