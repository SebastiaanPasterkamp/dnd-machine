import React from 'react';
import { shallow, mount } from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';

import { EncounterRating } from '../components/EncounterRating';

describe('View EncounterRating', () => {
    const easyProps = {
        encounter: 6,
        party: {
            easy: 10,
            medium: 20,
            hard: 30,
            deadly: 40,
        },
    };
    const mediumProps = {
        encounter: 62,
        party: {
            easy: 25,
            medium: 50,
            hard: 75,
            deadly: 100,
        },
    };
    const insaneProps = {
        encounter: 230,
        party: {
            easy: 50,
            medium: 100,
            hard: 150,
            deadly: 200,
        },
    };

    it('should render w/ minimum props', () => {
        const tree = renderer.create(
            <EncounterRating
            />
        );

        expect(tree.toJSON()).toMatchSnapshot();
    });

    describe('should render w/ various props;', () => {
        it('should identify an easy encounter', () => {
            const tree = renderer.create(
                <EncounterRating
                    {...easyProps}
                />
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });
        it('should identify an medium encounter', () => {
            const tree = renderer.create(
                <EncounterRating
                    {...mediumProps}
                />
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });
        it('should identify an insane encounter', () => {
            const tree = renderer.create(
                <EncounterRating
                    {...insaneProps}
                />
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });
    });
});
