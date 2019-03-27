import React from 'react';
import { mount } from 'enzyme';

import { AdventureLeagueLogEdit } from '../AdventureLeagueLogEdit';

describe('AdventureLeagueLogEdit', () => {
    it('should render with minimum props', () => {
        const setState = jest.fn();

        const wrapped = mount(
            <AdventureLeagueLogEdit
                setState={setState}
            />
        );

        expect(wrapped).toMatchSnapshot();
    });
});