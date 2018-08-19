import React from 'react';
import _ from 'lodash';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
jest.useFakeTimers();

import SelectPropertySelect from 'components/Character/SelectPropertySelect.jsx';

import CharacterEditorActions from 'actions/CharacterEditorActions.jsx';
import ListDataStore from 'stores/ListDataStore.jsx';

const { statistics } = require('../../__mocks__/apiCalls.js');

const character = {
    some: {
        path: 'charisma',
    },
};
const props = {
    type: 'select',
    path: 'some.path',
    items: statistics,
}

const mockedId = 'id_1';

describe('Component: SelectPropertySelect', () => {

    beforeEach(() => {
        _.uniqueId = jest.fn();
        _.uniqueId
            .mockReturnValueOnce(mockedId)
            .mockReturnValueOnce('unexpected_2');

        CharacterEditorActions.editCharacter.completed(character);
        ListDataStore.onFetchItemsCompleted(
            {statistics},
            'statistics'
        );

        jest.runAllTimers();
    });

    it('should not render anything', () => {
        const wrapper = mount(
            <SelectPropertySelect
                hidden={true}
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();
    });

    it('should render the list', () => {
        const wrapper = mount(
            <SelectPropertySelect
                {...props}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();
    });

    it('should emit addChange dispite being hidden', () => {
        const addChange = jest.spyOn(
            CharacterEditorActions,
            'addChange'
        );

        const wrapper = mount(
            <SelectPropertySelect
                hidden={true}
                {...props}
                />
        );

        expect(addChange)
            .toBeCalledWith(
                props.path,
                "charisma",
                mockedId,
                {
                    hidden: true,
                    type: props.type,
                    items: statistics,
                },
            );
    });

    it('should emit addChange on new selection', () => {
        const addChange = jest.spyOn(
            CharacterEditorActions,
            'addChange'
        );

        const wrapper = mount(
            <SelectPropertySelect
                {...props}
                />
        );

        addChange.mockClear();

        wrapper
            .find('button')
            .simulate('click');
        wrapper
            .find({'data-value': 'wisdom'})
            .simulate('click');

        expect(addChange)
            .toBeCalledWith(
                props.path,
                "wisdom",
                mockedId,
                {
                    type: props.type,
                    items: statistics,
                },

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
            <SelectPropertySelect
                {...props}
                />
        );

        expect(addChange)
            .toBeCalledWith(
                props.path,
                "wisdom",
                mockedId,
                {
                    type: props.type,
                    items: statistics,
                },

            );

        wrapper.unmount();

        expect(removeChange)
            .toBeCalledWith(mockedId);
    });
});
