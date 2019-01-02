import React from 'react';
import _ from 'lodash';
import {shallow} from 'enzyme';

import {UserView} from '../../src/jsx/views/UserView.jsx';


describe('UserView', () => {
    it('should render without props', () => {
        const wrapped = shallow(
            <UserView />
        );

        expect(wrapped).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const wrapped = shallow(
            <UserView
                id={1}
                name="Example User"
                dci="1234567890"
                email="user@example.com"
                role={['admin', 'dm', 'player']}
                user_roles={[
                    {code: 'admin', label: 'Admin'},
                    {code: 'dm', label: 'Dungeon Master'},
                    {code: 'player', label: 'Player'},
                ]}
            />
        );

        expect(wrapped).toMatchSnapshot();
    });
});