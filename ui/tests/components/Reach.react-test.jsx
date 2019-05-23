import React from 'react';
import Reach from '../../src/jsx/components/Reach.jsx';
import renderer from 'react-test-renderer';

describe('Reach', () => {
    it('should render nothing without props', () => {
        const tree = renderer.create(
            <Reach />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    describe('with min/max', () => {
        it('should show full range with units when min<max', () => {
            const tree = renderer.create(
                <Reach min={10} max={20} />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });

        it('should show min with unit when min==max', () => {
            const tree = renderer.create(
                <Reach min={5} max={5} />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });

        it('should show min with unit when min>max', () => {
            const tree = renderer.create(
                <Reach min={5} max={0} />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });
    });

    describe('with non-numeric distance', () => {
        it('should show just a text label', () => {
            const tree = renderer.create(
                <Reach distance="touch" />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });
    });

    describe('with explicit feet and/or inch', () => {
        it('should render only feet', () => {
            const tree = renderer.create(
                <Reach feet={1} />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });

        it('should render only inches', () => {
            const tree = renderer.create(
                <Reach inch={2} />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });

        it('should render both', () => {
            const tree = renderer.create(
                <Reach feet={3} inch={4} />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });
    });

    describe('with computed feet and/or inch', () => {
        it('should render only feet', () => {
            const tree = renderer.create(
                <Reach distance={1} />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });

        it('should render only inches', () => {
            const tree = renderer.create(
                <Reach distance={2/12} />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });

        it('should render both', () => {
            const tree = renderer.create(
                <Reach distance={10/3} />
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });
    });
});
