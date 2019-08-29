import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

jest.useFakeTimers();

import MultipleChoiceSelect from '../components/MultipleChoiceSelect.jsx';

import actions from '../actions/CharacterEditorActions.jsx';
import store from '../stores/CharacterEditorStore.jsx';

const props = {
    type: 'multichoice',
    label: 'Example',
    description: 'Pick some',
    options: [{
        label: 'Simple',
        path: 'foo.bar',
        type: 'dict',
        dict: {
            description: 'Bar is good',
        }
    }, {
        label: 'Complex',
        type: 'config',
        config: [{
            path: 'bar.foo',
            type: 'dict',
            dict: {
                description: 'Foo is okay',
            }
        }]
    }],
};

const mockedIds = [
    'id_1',
    'id_2',
    'id_3',
];

describe('Component: MultipleChoiceSelect', () => {

    beforeEach(() => {
        fp.uniqueId = _.uniqueId = jest.fn();
        _.uniqueId.mockReturnValue('unexpected');

        actions.editCharacter.completed({
            bar: {
                foo: {
                    description: 'Foo is bad',
                },
            },
        });

        _.uniqueId
            .mockReturnValueOnce(mockedIds[0])
            .mockReturnValueOnce(mockedIds[1])
            .mockReturnValueOnce(mockedIds[2])
            .mockReturnValue('unexpected');

        jest.runAllTimers();
    });

    afterEach(() => store.reset());

    it('should render with minimum props', () => {
        const tree = renderer.create(
            <MultipleChoiceSelect
                {...props}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const wrapper = mount(
            <MultipleChoiceSelect
                {...props}
                add={2}
                replace={1}
            />
        );

        expect(wrapper.find('button.nice-btn').length).toEqual(1);
        expect(wrapper.find('button.nice-tag-btn').length).toEqual(1);
        expect(wrapper.find('.markdown-textedit').length).toEqual(1);
    });

    it('should emit *Change actions on mount and umount', () => {
        const addChange = jest.spyOn(
            actions,
            'addChange'
        );
        const removeChange = jest.spyOn(
            actions,
            'removeChange'
        );

        const wrapper = mount(
            <MultipleChoiceSelect
                {...props}
                add={1}
            />
        );

        expect(addChange)
            .toBeCalledWith(
                props.options[1].config[0].path,
                props.options[1].config[0].dict,
                mockedIds[1],
                {
                    dict: props.options[1].config[0].dict,
                    type: props.options[1].config[0].type,
                }
            );

        wrapper.unmount();

        expect(removeChange)
            .toBeCalledWith(mockedIds[1]);
    });

    it('should handle replacing one existing', () => {
        const addChange = jest.spyOn(
            actions,
            'addChange'
        );

        const wrapper = mount(
            <MultipleChoiceSelect
                {...props}
                replace={1}
            />
        );

        wrapper
            .find('.nice-tag-btn')
            .at(0)
            .simulate('click');

        expect(addChange)
            .toBeCalledWith(
                props.options[1].config[0].path,
                props.options[1].config[0].dict,
                mockedIds[1],
                {
                    dict: props.options[1].config[0].dict,
                    type: props.options[1].config[0].type,
                }
            );

        expect(wrapper)
            .toMatchSnapshot();

        addChange.mockClear();

        wrapper
            .find('.nice-dropdown button')
            .simulate('click');
        wrapper
            .find('li[data-value="Complex"]')
            .simulate('click');

        expect(addChange)
            .toBeCalledWith(
                props.options[1].config[0].path,
                props.options[1].config[0].dict,
                mockedIds[2],
                {
                    dict: props.options[1].config[0].dict,
                    type: props.options[1].config[0].type,
                }
            );
    });

    it('should handle removing a new pick', () => {
        const addChange = jest.spyOn(
            actions,
            'addChange'
        );
        const removeChange = jest.spyOn(
            actions,
            'removeChange'
        );

        const wrapper = mount(
            <MultipleChoiceSelect
                {...props}
                add={1}
            />
        );

        addChange.mockClear();

        wrapper
            .find('.nice-dropdown button')
            .simulate('click');
        wrapper
            .find('li[data-value="Simple"]')
            .simulate('click');

        expect(addChange)
            .toBeCalledWith(
                props.options[0].path,
                props.options[0].dict,
                mockedIds[2],
                {
                    dict: props.options[0].dict,
                    type: props.options[0].type,
                }
            );

        expect(wrapper)
            .toMatchSnapshot();

        addChange.mockClear();

        wrapper
            .find('.nice-tag-btn')
            .at(0)
            .simulate('click');

        expect(removeChange)
            .toBeCalledWith(mockedIds[2]);

        expect(wrapper)
            .toMatchSnapshot();
    });
});
