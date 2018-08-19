import React from 'react';
import _ from 'lodash';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
jest.useFakeTimers();

import MultipleChoiceSelect from 'components/Character/MultipleChoiceSelect.jsx';

import CharacterEditorActions from 'actions/CharacterEditorActions.jsx';

const character = {
    bar: {
        foo: {
            description: 'Foo is bad',
        },
    },
};

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
        _.uniqueId = jest.fn();
        _.uniqueId
            .mockReturnValueOnce(mockedIds[0])
            .mockReturnValueOnce(mockedIds[1])
            .mockReturnValueOnce(mockedIds[2])
            .mockReturnValueOnce('unexpected_2');

        CharacterEditorActions.editCharacter.completed(character);
        jest.runAllTimers();
    });

    it('should render with minimum props', () => {
        const tree = renderer.create(
            <MultipleChoiceSelect
                {...props}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const tree = renderer.create(
            <MultipleChoiceSelect
                {...props}
                limit={2}
                replace={1}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should emit *Change actions on mount and umount', () => {
        const addChange = jest.spyOn(
            CharacterEditorActions,
            'addChange'
        );
        const removeChange = jest.spyOn(
            CharacterEditorActions,
            'removeChange'
        );

        const wrapper = mount(
            <MultipleChoiceSelect
                {...props}
                limit={1}
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
            CharacterEditorActions,
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

        wrapper.setProps({
            getCurrent: jest.fn(() => null),
        });

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

    it.skip('should handle removing a new pick', () => {
        const addChange = jest.spyOn(
            CharacterEditorActions,
            'addChange'
        );
        const removeChange = jest.spyOn(
            CharacterEditorActions,
            'removeChange'
        );

        const wrapper = mount(
            <MultipleChoiceSelect
                {...props}
                limit={1}
                />
        );

        addChange.mockClear();

        wrapper
            .find('.nice-dropdown button')
            .simulate('click');
        wrapper
            .find('li[data-value="Simple"]')
            .simulate('click');

        expect(wrapper)
            .toMatchSnapshot();

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

        addChange.mockClear();

        wrapper
            .find('.nice-tag-btn')
            .at(0)
            .simulate('click');

        expect(removeChange)
            .toBeCalledWith(mockedIds[0]);

        expect(wrapper)
            .toMatchSnapshot();
    });
});
