import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import { mockedApi } from '../../../../../tests/__mocks__';
import {
    id, name, level, gender, alignment, race, background, class as _class,
    xp, xp_progress, xp_level,
} from '../__mocks__/character';

import Description from '../components/Description';

describe('Description', () => {
    const fullProps = {
        id, name, level, gender, alignment, race, background,
        xp, xp_progress, xp_level, "class": _class,
    };

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
            alignments: [
                {
                    id: 'chaotic good',
                    name: 'Chaotic Good',
                },
            ],
            genders: [
                {
                    id: 'female',
                    name: 'Female',
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
