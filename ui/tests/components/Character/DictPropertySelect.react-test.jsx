import React from 'react';
import _ from 'lodash';
import { mount } from 'enzyme';
jest.useFakeTimers();

import DictPropertySelect from 'components/Character/DictPropertySelect.jsx';

import CharacterEditorActions from 'actions/CharacterEditorActions.jsx';

const character = {
    some: {
        path: {
            description: 'This shows _%(type)s_ content',
            type: 'old',
        },
    },
};
const props = {
    type: 'dict',
    path: 'some.path',
    dict: {
        type: 'new',
    },
};

const mockedId = 'id_1';

describe('Component: DictPropertySelect', () => {

    beforeEach(() => {
        _.uniqueId = jest.fn();
        _.uniqueId
            .mockReturnValueOnce(mockedId)
            .mockReturnValueOnce('unexpected_2');

        CharacterEditorActions.editCharacter.completed(character);
        jest.runAllTimers();
    });

    it('should not render anything while hidden', () => {
        const wrapper = mount(
            <DictPropertySelect
                {...props}
                hidden={true}
                />
        );
        jest.runAllTimers();

        expect(wrapper)
            .toMatchSnapshot();
    });

    it('should render the updated description', () => {
        const wrapper = mount(
            <DictPropertySelect
                {...props}
                />
        );
        jest.runAllTimers();

        expect(wrapper)
            .toMatchSnapshot();
    });

    it('should emit onChange dispite being hidden', () => {
        const addChange = jest.spyOn(
            CharacterEditorActions,
            'addChange'
        );

        const wrapper = mount(
            <DictPropertySelect
                {...props}
                hidden={true}
                />
        );

        expect(addChange)
            .toBeCalledWith(
                props.path,
                props.dict,
                mockedId,
                {
                    type: 'dict',
                    dict: props.dict,
                    hidden: true,
                }
             );
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
            <DictPropertySelect
                {...props}
                />
        );

        expect(addChange)
            .toBeCalledWith(
                props.path,
                props.dict,
                mockedId,
                {
                    type: 'dict',
                    dict: props.dict,
                }
             );

        wrapper.unmount();

        expect(removeChange)
            .toBeCalledWith(mockedId);
    });
});
