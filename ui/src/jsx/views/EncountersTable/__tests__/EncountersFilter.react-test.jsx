import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import {
    mockedApi,
} from '../../../../../tests/__mocks__';

import EncountersFilter from '../components/EncountersFilter';

describe('EncountersFilter', () => {

    const fullProps = {
        text: 'bar',
        campaign: [2],
        cr: {
            min: 0.1,
            max: 0.75,
        },
        xp: {
            min: 5,
            max: 50,
        },
    };

    beforeAll(() => {
        fetch.mockImplementation( mockedApi({
            campaign: {
                2: { id: 2, name: "Some campaign" },
            },
        }) );
    });

    afterAll(() => fetch.resetMocks());

    it('should render without props', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <EncountersFilter
                setState={setState}
            />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <EncountersFilter
                {...fullProps}
                setState={setState}
            />
        );

        expect(tree).toMatchSnapshot();
    });

    describe('when filtering', () => {
        let wrapper, setState;

        beforeEach(() => {
            setState = jest.fn();
            wrapper = mount(
                <EncountersFilter setState={setState} />
            );
        });

        it('should update text', () => {
            wrapper
                .find('input[data-name="search"]')
                .simulate('change', {target: {value: 'foo'}});

            expect(setState).toBeCalledWith({
                text: 'foo',
            });
        });

        it('should update attribute', () => {
            wrapper
                .find('[data-name="campaign"] [data-value=2] input')
                .simulate('change');

            expect(setState).toBeCalledWith({
                campaign: [2],
            });
        });

        it('should update min', () => {
            wrapper
                .find('[data-name="cr"] input')
                .at(0)
                .simulate('change', {target: {value: 1}});

            expect(setState).toBeCalledWith({
                cr: { min: 1, max: null }
            });
        });

        it('should update max', () => {
            wrapper
                .find('[data-name="xp"] input')
                .at(1)
                .simulate('change', {target: {value: 75}});

            expect(setState).toBeCalledWith({
                xp: { min: null, max: 75 }
            });
        });
    });
});
