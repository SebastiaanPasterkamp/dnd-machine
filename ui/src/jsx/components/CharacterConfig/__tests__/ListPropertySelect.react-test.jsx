import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import { mount } from 'enzyme';

import { statistics } from '../../../../../tests/__mocks__';

jest.useFakeTimers();
jest.mock('../../../actions/ListDataActions.jsx');

import ListPropertySelect from '../components/ListPropertySelect.jsx';

import actions from '../actions/CharacterEditorActions.jsx';
import store from '../stores/CharacterEditorStore.jsx';
import ListDataStore from '../../../stores/ListDataStore.jsx';

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

    it('should render with minimum props', () => {
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

    it('should not render select w/o items', () => {
        const wrapper = mount(
            <ListPropertySelect
                {...props}
                list={undefined}
                add={1}
            />
        );
        jest.runAllTimers();

        expect(wrapper)
            .toMatchSnapshot();
    });

    it('should not render select w/ filtering all items', () => {
        const wrapper = mount(
            <ListPropertySelect
                {...props}
                add={1}
                filter={{ code: ['impossible'] }}
            />
        );
        jest.runAllTimers();

        expect(wrapper)
            .toMatchSnapshot();
    });

    it('should not render when hidden', () => {
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
                add={2}
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

    it('should omit unknown current values', () => {
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

    it('should allow replacing one existing', () => {
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

        addChange.mockClear();
        wrapper
            .find('.fa-trash-o')
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

    it('should handle adding and deleting new', () => {
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
                add={1}
            />
        );
        jest.runAllTimers();

        expect(wrapper)
            .toMatchSnapshot();

        addChange.mockClear();
        wrapper
            .find('.nice-btn')
            .simulate('click');
        wrapper
            .find('[data-value="strength"]')
            .simulate('click');
        jest.runAllTimers();

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
                    add: 1,
                    type: props.type,
                    items: statistics,
                },
            );

        expect(wrapper).toMatchSnapshot();

        actions.addChange(
            'some.path',
            {added: ['intelligence'], removed: []},
            'id_2',
            {type: 'list'},
        );
        jest.runAllTimers();
        wrapper.update();

        expect(wrapper).toMatchSnapshot();

        addChange.mockClear();

        wrapper
            .find('.nice-tag-btn')
            .at(0)
            .simulate('click');
        jest.runAllTimers();

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
                    add: 1,
                    type: props.type,
                    items: statistics,
                },
            );

        expect(wrapper).toMatchSnapshot();
    });

    describe('should allow a limited number of tags', () => {
        let wrapper;

        it('accepts limit parameter', () => {
            wrapper = mount(
                <ListPropertySelect
                    {...props}
                    limit={3}
                />
            );
            jest.runAllTimers();
        });

        it('shows existing tab without delete button, and a select', () => {
            expect(wrapper.find('.nice-tag-label').length).toBe(1);
            expect(wrapper.find('.fa-trash-o').length).toBe(0);
            expect(wrapper.find('.nice-btn').length).toBe(1);
        });

        it('add a new item adds a tag, delete button, but keeps select', () => {
            wrapper.find('.nice-btn').simulate('click');
            wrapper.find('[data-value="strength"]').simulate('click');
            jest.runAllTimers();

            expect(wrapper.find('.nice-tag-label').length).toBe(2);
            expect(wrapper.find('.fa-trash-o').length).toBe(1);
            expect(wrapper.find('.nice-btn').length).toBe(1);
        });

        it('add last item adds a tag and delete button, but removes select', () => {
            wrapper.find('.nice-btn').simulate('click');
            wrapper.find('[data-value="charisma"]').simulate('click');
            jest.runAllTimers();

            expect(wrapper.find('.nice-tag-label').length).toBe(3);
            expect(wrapper.find('.fa-trash-o').length).toBe(2);
            expect(wrapper.find('.nice-btn').length).toBe(0);
        });

        it('remove a new item removes a tag and delete button, but re-adds the select', () => {
            wrapper.find('.fa-trash-o').at(0).simulate('click');
            jest.runAllTimers();

            expect(wrapper.find('.nice-btn').length).toBe(1);
            expect(wrapper.find('.nice-tag-label').length).toBe(2);
            expect(wrapper.find('.fa-trash-o').length).toBe(1);
        });
    });
});
