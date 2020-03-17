import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import {
    get,
} from 'lodash/fp';

import store from '../stores/CharacterEditorStore';

import { MultipleChoiceSelect } from '../components/MultipleChoiceSelect';

const props = {
    type: 'multichoice',
    uuid: 'mocked-uuid-1',
    name: 'Example',
    description: 'Pick some',
    options: [{
        type: 'dict',
        uuid: 'mocked-uuid-2',
        path: 'foo.bar',
        name: 'Simple',
        dict: {
            description: 'Bar is good',
        },
    }, {
        type: 'config',
        uuid: 'mocked-uuid-3',
        name: 'Complex',
        config: [{
            type: 'dict',
            uuid: 'mocked-uuid-4',
            path: 'bar.foo',
            dict: {
                description: 'Foo is better',
            },
        }]
    }],
    choices: {
        'mocked-uuid-3': true,
    },
};

describe('Component: MultipleChoiceSelect', () => {

    beforeEach(() => {
        store.onEditCharacterCompleted({
            bar: {
                foo: {
                    description: 'Foo is bad',
                },
            },
        });
    });

    afterEach(() => store.reset());

    it('should render with minimum props', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <MultipleChoiceSelect
                setState={setState}
                type={props.type}
                uuid={props.uuid}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
        expect(setState).not.toBeCalled();
    });

    it('should render with full props', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <MultipleChoiceSelect
                setState={setState}
                {...props}
                add={2}
                replace={1}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
        expect(setState).not.toBeCalled();
    });

    it('should render some buttons', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <MultipleChoiceSelect
                setState={setState}
                {...props}
                add={2}
                replace={1}
            />
        );

        expect(wrapper.find('button.nice-btn').length).toEqual(1);
        expect(wrapper.find('button.nice-tag-btn').length).toEqual(1);
        expect(setState).not.toBeCalled();
    });

    it('should handle replacing one existing', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <MultipleChoiceSelect
                setState={setState}
                {...props}
                replace={1}
            />
        );

        wrapper.find('.nice-tag-btn').simulate('click');

        expect(setState).toBeCalledWith({
            added: [],
            removed: ['mocked-uuid-3'],
        });

        wrapper.setProps({
            added: [],
            removed: ["mocked-uuid-3"],
        });

        expect(wrapper).toMatchSnapshot();

        wrapper.find('.nice-btn').simulate('click');
        wrapper.find('li[data-value="mocked-uuid-2"]').simulate('click');

        expect(setState).toBeCalledWith({
            added: ["mocked-uuid-2"],
            removed: ["mocked-uuid-3"],
        });
    });

    it('should handle removing a new pick', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <MultipleChoiceSelect
                setState={setState}
                {...props}
                add={1}
            />
        );

        wrapper.find('.nice-btn').simulate('click');
        wrapper.find('li[data-value="mocked-uuid-2"]').simulate('click');

        expect(setState).toBeCalledWith({
            added: ["mocked-uuid-2"],
            removed: [],
        });

        wrapper.setProps({
            added: ["mocked-uuid-2"],
            removed: [],
        });

        expect(wrapper).toMatchSnapshot();

        wrapper.find('.nice-tag-btn').at(0).simulate('click');

        expect(setState).toBeCalledWith({
            added: [],
            removed: [],
        });

        wrapper.setProps({
            added: [],
            removed: [],
        });

        expect(wrapper).toMatchSnapshot();
    });
});
