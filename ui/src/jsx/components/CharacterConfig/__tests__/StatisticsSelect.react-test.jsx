import React from 'react';
import { mount } from 'enzyme';

import { mockedApi, statistics } from '../../../../../tests/__mocks__';
import ListDataActions from 'actions/ListDataActions';

import { StatisticsSelect } from '../components/StatisticsSelect';

const ASIProps = {
    type: 'ability_score',
    uuid: 'mock-uuid-asi-1',
    limit: 2,
};

const statsProps = {
    type: 'statistics',
    uuid: 'mock-uuid-stats-1',
    editBase: true,
};

describe('Component: StatisticsSelect', () => {

    beforeAll(() => {
        fetch.mockImplementation( mockedApi({
            statistics,
        }) );
        ListDataActions.fetchItems('statistics');
    });

    afterAll(() => fetch.resetMocks());

    it('should render with minimum props', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <StatisticsSelect
                setState={setState}
                type={ASIProps.type}
                uuid={ASIProps.uuid}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(setState).not.toBeCalled();
    });

    it('should render with ASI props', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <StatisticsSelect
                setState={setState}
                {...ASIProps}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render with base stats props', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <StatisticsSelect
                setState={setState}
                {...statsProps}
                minBare={ 10 }
                maxBare={ 10 }
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
