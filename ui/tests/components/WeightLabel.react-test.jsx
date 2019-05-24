import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import WeightLabel from 'components/WeightLabel';

describe('WeightLabel', () => {
    it('should render nothing without props', () => {
        const tree = renderer.create(
            <WeightLabel />
        );

        expect(tree).toMatchSnapshot();
    });

    describe('with explicity lb and/or oz', () => {
        it('should render only lb', () => {
            const tree = renderer.create(
                <WeightLabel lb={1} />
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render only oz', () => {
            const tree = renderer.create(
                <WeightLabel oz={2} />
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render both', () => {
            const tree = renderer.create(
                <WeightLabel lb={3} oz={4} />
            );

            expect(tree).toMatchSnapshot();
        });
    });

    describe('with computed weight', () => {
        it('should render only lb', () => {
            const tree = renderer.create(
                <WeightLabel weight={1} />
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render only oz', () => {
            const tree = renderer.create(
                <WeightLabel weight={0.125} />
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render both', () => {
            const tree = renderer.create(
                <WeightLabel weight={3.25} />
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
