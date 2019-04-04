import React from 'react';
import ChallengeRating from 'components/ChallengeRating.jsx';
import renderer from 'react-test-renderer';

describe('Component: ChallengeRating', () => {
    it('should render without props', () => {
        const tree = renderer.create(
            <ChallengeRating
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render "CR 0"', () => {
        const tree = renderer.create(
            <ChallengeRating
                challengeRating={0}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a fraction CR number', () => {
        const tree = renderer.create(
            <ChallengeRating
                challengeRating={0.2}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a high CR number', () => {
        const tree = renderer.create(
            <ChallengeRating
                challengeRating={13.37}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a CR float', () => {
        const tree = renderer.create(
            <ChallengeRating
                challengeRating={0.2}
                precise={true}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render a high CR float', () => {
        const tree = renderer.create(
            <ChallengeRating
                challengeRating={13.37}
                precise={true}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
