import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import { mount } from 'enzyme';
jest.useFakeTimers();

import DictPropertySelect from 'components/Character/DictPropertySelect.jsx';

import actions from 'actions/CharacterEditorActions.jsx';
import store from 'stores/CharacterEditorStore.jsx';

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
        fp.uniqueId = _.uniqueId = jest.fn();
        _.uniqueId
            .mockReturnValueOnce(mockedId)
            .mockReturnValueOnce('unexpected_2');

        actions.editCharacter.completed({
            some: {
                path: {
                    description: 'This shows _%(type)s_ content',
                    type: 'old',
                },
            },
        });

        jest.runAllTimers();
    });

    afterEach(() => store.reset());

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
            actions,
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
            actions,
            'addChange'
        );
        const removeChange = jest.spyOn(
            actions,
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
