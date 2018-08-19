import React from 'react';
import _ from 'lodash';
import { mount } from 'enzyme';
jest.useFakeTimers();

import ValuePropertySelect from 'components/Character/ValuePropertySelect.jsx';

import CharacterEditorActions from 'actions/CharacterEditorActions.jsx';

const character = {
    some: {
        path: 'This shows _old_ content',
    },
};
const props = {
    path: 'some.path',
    type: 'value',
    value: "This shows _formatted_ content.",
};

const mockedId = 'id_1';

describe('Component: ValuePropertySelect', () => {

    beforeEach(() => {
        _.uniqueId = jest.fn();
        _.uniqueId
            .mockReturnValueOnce(mockedId)
            .mockReturnValueOnce('unexpected_2');

        CharacterEditorActions.editCharacter.completed(character);
        jest.runAllTimers();
    });

    it('should not render anything when hidden', () => {
        const wrapper = mount(
            <ValuePropertySelect
                {...props}
                hidden={true}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();
    });

    it('should render the formatted description', () => {
        const wrapper = mount(
            <ValuePropertySelect
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();
    });

    it('should emit onChange dispite being hidden', () => {
        const addChange = jest.spyOn(
            CharacterEditorActions,
            'addChange'
        );

        const wrapper = mount(
            <ValuePropertySelect
                {...props}
                hidden={true}
                />
        );

        expect(addChange)
            .toBeCalledWith(
                props.path,
                props.value,
                mockedId,
                {
                    type: props.type,
                    value: props.value,
                    hidden: true,
                }
             );
    });

    it('should emit onChange on mount and umount', () => {
        const addChange = jest.spyOn(
            CharacterEditorActions,
            'addChange'
        );
        const removeChange = jest.spyOn(
            CharacterEditorActions,
            'removeChange'
        );

        const wrapper = mount(
            <ValuePropertySelect
                {...props}
                />
        );

        expect(addChange)
            .toBeCalledWith(
                props.path,
                props.value,
                mockedId,
                {
                    type: props.type,
                    value: props.value,
                    hidden: true,
                }
             );

        wrapper.unmount();

        expect(removeChange)
            .toBeCalledWith(mockedId);
    });
});
