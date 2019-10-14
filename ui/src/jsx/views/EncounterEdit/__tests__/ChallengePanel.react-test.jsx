import React from 'react';
import { shallow, mount } from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';

import ChallengePanel from '../components/ChallengePanel';

describe('View ChallengePanel', () => {
    const fullProps = {
        modifier: {
            monster: 1.0,
            party: 0.0,
            total: 1.0,
        },
        challenge_rating: 2,
        challenge_modified: 2.0,
        challenge_rating_precise: 2.2,
        xp: 50,
        xp_modified: 50,
        xp_rating: 55,
        hosted_party: {
            id: 4,
            size: 4,
            challenge: {
                easy: 20,
                medium: 40,
                hard: 60,
                deadly: 80,
            },
        },
    };

    describe('rendering', () => {
        it('should work w/ minimum props', () => {
            const tree = renderer.create(
                <ChallengePanel />
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('should work with only the encounter loaded', () => {
            const tree = renderer.create(
                <ChallengePanel
                    {...fullProps}
                    hosted_party={undefined}
                />
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('should work without a party', () => {
            const tree = renderer.create(
                <ChallengePanel
                    {...fullProps}
                    hosted_party={null}
                />
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('should work with only the party loaded', () => {
            const tree = renderer.create(
                <ChallengePanel
                    hosted_party={fullProps.hosted_party}
                />
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('should work with all props', () => {
            const tree = renderer.create(
                <ChallengePanel
                    {...fullProps}
                />
            );

            expect(tree.toJSON()).toMatchSnapshot();
        });
    });
});
