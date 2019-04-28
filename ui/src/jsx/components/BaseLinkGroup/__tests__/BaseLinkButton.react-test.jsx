import React from 'react';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import BaseLinkButton from '../BaseLinkButton.jsx';

describe('Component: BaseLinkButton', () => {
    describe('should render as', () => {
        it('an action', () => {
            const tree = renderer.create(
                <MockRouter>
                    <BaseLinkButton
                        name="action"
                        action={() => console.log("click")}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('a download link', () => {
            const tree = renderer.create(
                <MockRouter>
                    <BaseLinkButton
                        name="download"
                        download="/as/a/download"
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('a router link', () => {
            const tree = renderer.create(
                <MockRouter>
                    <BaseLinkButton
                        name="link"
                        link="/as/a/link"
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('nothing for the same route', () => {
            const tree = renderer.create(
                <MockRouter
                    location={{
                        pathname: '/at/same/route',
                    }}
                >
                    <BaseLinkButton
                        name="link"
                        link="/at/same/route"
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });
    });

    describe('should render', () => {
        it('with minimum props', () => {
            const tree = renderer.create(
                <MockRouter>
                    <BaseLinkButton
                        name="blank"
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('with alt style', () => {
            const tree = renderer.create(
                <MockRouter>
                    <BaseLinkButton
                        name="alt"
                        download="/alt-style"
                        altStyle={true}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('with icon', () => {
            const tree = renderer.create(
                <MockRouter>
                    <BaseLinkButton
                        name="icn"
                        download="/icon"
                        icon="pencil"
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('with class', () => {
            const tree = renderer.create(
                <MockRouter>
                    <BaseLinkButton
                        name="download"
                        download="/class-name"
                        className="class-name"
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('disabled', () => {
            const tree = renderer.create(
                <MockRouter>
                    <BaseLinkButton
                        name="nope"
                        download="/class-name"
                        disabled={true}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
