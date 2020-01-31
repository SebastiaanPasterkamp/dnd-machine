import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import {
    get,
} from 'lodash/fp';

import { MultipleChoiceSelect } from '../components/MultipleChoiceSelect';

const props = {
    type: 'multichoice',
    uuid: 'mocked-uuid-1',
    label: 'Example',
    description: 'Pick some',
    options: [{
        type: 'dict',
        uuid: 'mocked-uuid-2',
        path: 'foo.bar',
        label: 'Simple',
        dict: {
            description: 'Bar is good',
        }
    }, {
        type: 'config',
        uuid: 'mocked-uuid-3',
        label: 'Complex',
        config: [{
            type: 'dict',
            uuid: 'mocked-uuid-4',
            path: 'bar.foo',
            dict: {
                description: 'Foo is okay',
            }
        }]
    }],
};

describe('Component: MultipleChoiceSelect', () => {
    const character = {
        bar: {
            foo: {
                description: 'Foo is bad',
            },
        },
    };
    const getCurrent = function(path) {
        return get(path, character);
    };

    it('should render with minimum props', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <MultipleChoiceSelect
                setState={setState}
                getCurrent={getCurrent}
                type={props.type}
                uuid={props.uuid}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
        expect(setState).not.toBeCalled();
    });

    it('should render with full props', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <MultipleChoiceSelect
                setState={setState}
                getCurrent={getCurrent}
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
                getCurrent={getCurrent}
                {...props}
                replace={1}
            />
        );

        wrapper.find('.nice-tag-btn').simulate('click');

        expect(setState).toBeCalledWith({
            added: [],
            removed: ['mocked-uuid-3'],
            filtered: [],
        });

        wrapper.setProps({
            added: [],
            removed: ["mocked-uuid-3"],
            filtered: [],
        });

        expect(wrapper).toMatchSnapshot();

        wrapper.find('.nice-btn').simulate('click');
        wrapper.find('li[data-value="mocked-uuid-2"]').simulate('click');

        expect(setState).toBeCalledWith({
            added: ["mocked-uuid-2"],
            removed: ["mocked-uuid-3"],
            filtered: [],
        });
    });

    it('should handle removing a new pick', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <MultipleChoiceSelect
                setState={setState}
                getCurrent={getCurrent}
                {...props}
                add={1}
            />
        );

        wrapper.find('.nice-btn').simulate('click');
        wrapper.find('li[data-value="mocked-uuid-2"]').simulate('click');

        expect(setState).toBeCalledWith({
            added: ["mocked-uuid-2"],
            removed: [],
            filtered: [],
        });

        wrapper.setProps({
            added: ["mocked-uuid-2"],
            removed: [],
            filtered: [],
        });

        expect(wrapper).toMatchSnapshot();

        wrapper.find('.nice-tag-btn').at(0).simulate('click');

        expect(setState).toBeCalledWith({
            added: [],
            removed: [],
            filtered: ["mocked-uuid-2"],
        });

        wrapper.setProps({
            added: [],
            removed: [],
            filtered: ["mocked-uuid-2"],
        });

        expect(wrapper).toMatchSnapshot();
    });
});
