import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import { mockedApi } from '../../../../../tests/__mocks__';

import Description from '../components/Description';

describe('Description', () => {
    const fullProps = {
        id: 1,
        name: "FooBar McFooBarface",
        level: 1,
        gender: 'male',
        alignment: 'true neutral',
        race: 'Human',
        'class': 'Bard',
        background: 'Tester',
    };

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
            alignments: [
                {
                    code: 'true neutral',
                    label: 'True neutral',
                },
            ],
            genders: [
                {
                    code: 'male',
                    label: 'Male',
                },
            ],
            '(user|character)' : {},
        }) );
    })

    afterEach(() => {
        fetch.resetMocks()
    })

    it('should render without props', () => {
        const tree = renderer.create(
            <MockRouter>
                <Description />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <MockRouter>
                <Description {...fullProps} />
            </MockRouter>
        );

        expect(tree).toMatchSnapshot();
    });
});
