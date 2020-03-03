import React from 'react';
import _ from 'lodash';
import {shallow, mount} from 'enzyme';

import {UserEdit} from '../../src/jsx/views/UserEdit.jsx';
import RoutedObjectDataWrapper from '../../src/jsx/hocs/RoutedObjectDataWrapper.jsx';

describe('UserEdit', () => {
    var onSetState;

    beforeEach(() => onSetState = jest.fn());

    afterEach(() => jest.clearAllMocks());

    it('should render with minimum props', () => {
        const wrapped = shallow(
            <UserEdit
                setState={onSetState}
                current_user={{
                    role: [],
                }}
            />
        );

        expect(wrapped).toMatchSnapshot();

        expect(onSetState).not.toBeCalled();
    });

    it('should render with full props', () => {
        const wrapped = shallow(
            <UserEdit
                setState={onSetState}
                id={1}
                name="Example User"
                dci="1234567890"
                email="user@example.com"
                role={['dm', 'player']}
                user_roles={[
                    {id: 'admin', name: 'Admin'},
                    {id: 'dm', name: 'Dungeon Master'},
                    {id: 'player', name: 'Player'},
                ]}
                current_user={{
                    role: [],
                }}
                google_id="whatever"
                googleAuth={true}
            />
        );

        expect(wrapped).toMatchSnapshot();
    });

    it('should render with full props as admin', () => {
        const wrapped = shallow(
            <UserEdit
                setState={onSetState}
                id={1}
                name="Example User"
                dci="1234567890"
                email="user@example.com"
                role={['player']}
                user_roles={[
                    {id: 'admin', name: 'Admin'},
                    {id: 'dm', name: 'Dungeon Master'},
                    {id: 'player', name: 'Player'},
                ]}
                current_user={{
                    id: 2,
                    role: ['admin'],
                }}
                googleAuth={true}
            />
        );

        expect(wrapped).toMatchSnapshot();
    });

    it('should render with full props as admin', () => {
        const wrapped = shallow(
            <UserEdit
                setState={onSetState}
                id={1}
                name="Example User"
                dci="1234567890"
                email="user@example.com"
                role={['player']}
                user_roles={[
                    {id: 'admin', name: 'Admin'},
                    {id: 'dm', name: 'Dungeon Master'},
                    {id: 'player', name: 'Player'},
                ]}
                current_user={{
                    role: ['admin'],
                }}
            />
        );
    });

    it('should formulate a user after editing', () => {
        const WrappedUserEdit = RoutedObjectDataWrapper(
            UserEdit,
            {},
            'user'
        );
        const wrapper = mount(
            <WrappedUserEdit
                user_roles={[
                    {id: 'admin', name: 'Admin'},
                    {id: 'dm', name: 'Dungeon Master'},
                    {id: 'player', name: 'Player'},
                ]}
                current_user={{
                    role: ['admin'],
                }}
            />
        );

        wrapper
            .find('input[placeholder="Username..."]')
            .simulate('change', {target: {value: 'name'}});
        wrapper
            .find('input[placeholder="Full name..."]')
            .simulate('change', {target: {value: 'Full Name'}});
        wrapper
            .find('input[type="password"]')
            .simulate('change', {target: {value: 'secret'}});
        wrapper
            .find('input[type="email"]')
            .simulate('change', {target: {value: 'full.name@email.com'}});
        wrapper
            .find('input[placeholder="DCI..."]')
            .simulate('change', {target: {value: '123123123'}});

        wrapper
            .find('.user-edit__permissions .nice-btn')
            .simulate('click');
        wrapper
            .find('.user-edit__permissions li[data-value="player"] a')
            .simulate('click');

        expect(wrapper.state('user')).toMatchSnapshot();
    });
});
