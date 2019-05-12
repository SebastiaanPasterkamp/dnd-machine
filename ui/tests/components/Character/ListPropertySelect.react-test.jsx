import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import { mount } from 'enzyme';
jest.useFakeTimers();

jest.mock('actions/ListDataActions.jsx');

import ListPropertySelect from 'components/Character/ListPropertySelect.jsx';

import actions from 'actions/CharacterEditorActions.jsx';
import store from 'stores/CharacterEditorStore.jsx';
import ListDataStore from 'stores/ListDataStore.jsx';

const { statistics } = require('../../__mocks__/apiCalls.js');

const props = {
    type: 'list',
    path: 'some.path',
    list: ['statistics'],
}

const mockedId = 'id_1';

describe('Component: ListPropertySelect', () => {

    beforeEach(() => {
        fp.uniqueId = _.uniqueId = jest.fn();
        _.uniqueId
            .mockReturnValueOnce(mockedId)
            .mockReturnValueOnce('unexpected_2');

        actions.editCharacter.completed({
            some: {
                path: ['dexterity'],
            },
        });

        ListDataStore.onFetchItemsCompleted(
            {statistics},
            'statistics'
        );

        jest.runAllTimers();
    });

    afterEach(() => store.reset());

    it.skip('should render with minimum props', () => {
        const wrapper = mount(
            <ListPropertySelect
                path="some.path"
                type="list"
                />
        );
        jest.runAllTimers();

        expect(wrapper)
            .toMatchSnapshot();
    });

    it.skip('should not render select w/o items', () => {
        const wrapper = mount(
            <ListPropertySelect
                {...props}
                list={undefined}
                limit={1}
                />
        );
        jest.runAllTimers();

        expect(wrapper)
            .toMatchSnapshot();
    });

    it.skip('should not render select w/ filtering all items', () => {
        const wrapper = mount(
            <ListPropertySelect
                {...props}
                limit={1}
                filter={{ code: ['impossible'] }}
                />
        );
        jest.runAllTimers();

        expect(wrapper)
            .toMatchSnapshot();
    });

    it.skip('should not render when hidden', () => {
        const wrapper = mount(
            <ListPropertySelect
                {...props}
                hidden={true}
                />
        );
        jest.runAllTimers();

        expect(wrapper)
            .toMatchSnapshot();
    });

    it('should render with full props', () => {
        const wrapper = mount(
            <ListPropertySelect
                {...props}
                given={[
                    'constitution',
                    'charisma',
                ]}
                limit={2}
                replace={1}
                filter={{
                    code: [
                        'strength',
                        'intelligence',
                    ],
                    some_formula: 'blah blah',
                }}
                multiple={true}
                />
        );
        jest.runAllTimers();

        expect(wrapper)
            .toMatchSnapshot();
    });

    it.skip('should omit unknown current values', () => {
        const wrapper = mount(
            <ListPropertySelect
                {...props}
                given={[
                    'foo',
                ]}
                />
        );
        jest.runAllTimers();

        expect(wrapper)
            .toMatchSnapshot();
    });

    it.skip('should emit *Change actions on mount and umount', () => {
        const addChange = jest.spyOn(
            actions,
            'addChange'
        );
        const removeChange = jest.spyOn(
            actions,
            'removeChange'
        );
        const wrapper = mount(
            <ListPropertySelect
                {...props}
                given={[
                    'strength',
                    'charisma',
                ]}
                />
        );

        expect(addChange)
            .toBeCalledWith(
                props.path,
                {
                    "added": ["strength", "charisma"],
                    "removed": [],
                },
                mockedId,
                {
                    given: [
                        'strength',
                        'charisma',
                    ],
                    type: props.type,
                    items: statistics,
                },
            );

        wrapper.unmount();

        expect(removeChange)
            .toBeCalledWith(mockedId);
    });

    it.skip('should handle replacing one existing', () => {
        const addChange = jest.spyOn(
            actions,
            'addChange'
        );
        const wrapper = mount(
            <ListPropertySelect
                {...props}
                given={[
                    'charisma',
                ]}
                filter={{ code: ['strength'] }}
                replace={1}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();

        addChange.mockClear();
        wrapper
            .find('.nice-tag-btn')
            .at(0)
            .simulate('click');
        expect(addChange)
            .toBeCalledWith(
                props.path,
                {
                    "added": ["charisma"],
                    "removed": ["dexterity"],
                },
                mockedId,
                {
                    given: [
                        'charisma',
                    ],
                    filter: { code: ['strength'] },
                    replace: 1,
                    type: props.type,
                    items: statistics,
                },
            );

        actions.addChange(
            'some.path',
            {added: ['intelligence'], removed: []},
            'id_2',
            {type: 'list'},
        );

        addChange.mockClear();

        expect(addChange).not.toBeCalled();

        jest.runAllTimers();
        expect(wrapper)
            .toMatchSnapshot();

        wrapper
            .find('.nice-btn')
            .simulate('click');
        wrapper
            .find('[data-value="strength"]')
            .simulate('click');

        expect(addChange)
            .toBeCalledWith(
                props.path,
                {
                    "added": ["strength", "charisma"],
                    "removed": ["dexterity"],
                },
                mockedId,
                {
                    given: [
                        'charisma',
                    ],
                    filter: { code: ['strength'] },
                    replace: 1,
                    type: props.type,
                    items: statistics,
                },
            );

        expect(wrapper)
            .toMatchSnapshot();
    });

    it.skip('should handle adding and deleting new', () => {
        const addChange = jest.spyOn(
            actions,
            'addChange'
        );
        const wrapper = mount(
            <ListPropertySelect
                {...props}
                given={[
                    'charisma',
                ]}
                limit={1}
                />
        );

        expect(wrapper)
            .toMatchSnapshot();

        addChange.mockClear();
        wrapper
            .find('.nice-btn')
            .simulate('click');
        wrapper
            .find('[data-value="strength"]')
            .simulate('click');

        expect(addChange)
            .toBeCalledWith(
                props.path,
                {
                    "added": ["strength", "charisma"],
                    "removed": [],
                },
                mockedId,
                {
                    given: [
                        'charisma',
                    ],
                    limit: 1,
                    type: props.type,
                    items: statistics,
                },
            );

        actions.addChange(
            'some.path',
            {added: ['intelligence'], removed: []},
            'id_2',
            {type: 'list'},
        );

        addChange.mockClear();

        expect(addChange).not.toBeCalled();

        expect(wrapper).toMatchSnapshot();

        wrapper
            .find('.nice-tag-btn')
            .at(0)
            .simulate('click');
        expect(addChange)
            .toBeCalledWith(
                props.path,
                {
                    "added": ["charisma"],
                    "removed": [],
                },
                mockedId,
                {
                    given: [
                        'charisma',
                    ],
                    limit: 1,
                    type: props.type,
                    items: statistics,
                },
            );

        expect(wrapper).toMatchSnapshot();
    });
});
