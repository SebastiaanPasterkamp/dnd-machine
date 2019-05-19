import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { mockedApi } from '../../../../../tests/__mocks__';

import Information from '../components/Information';

describe('Information', () => {
    const fullProps = {
        race: 'Human',
        'class': 'Bard',
        background: 'Tester',
        alignment: 'true neutral',
        xp: 150,
        adventure_checkpoints: 3,
        user_id: 1,
    };

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
            alignments: [
                {
                    code: 'true neutral',
                    label: 'True neutral',
                },
            ],
            'user' : {},
        }) );
    })

    afterEach(() => {
        fetch.resetMocks()
    })

    it('should render without props', () => {
        const tree = renderer.create(
            <Information />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <Information {...fullProps} />
        );

        expect(tree).toMatchSnapshot();
    });
});
