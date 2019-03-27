import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { AdventureSession } from '../components/AdventureSession';

describe('AdventureSession', () => {
    const fullProps = {
        name: "Session name",
        id: "DDAL-007",
        date: "1970-01-01",
        dm_name: "Foo Bar",
        dm_dci: "013123123123",
    };

    it('should render with minimum props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <AdventureSession
                setState={setState}
            />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <AdventureSession
                setState={setState}
                {...fullProps}
            />
        );

        expect(tree).toMatchSnapshot();
    });

    describe('should emit change', () => {
        const setState = jest.fn();

        const tree = mount(
            <AdventureSession
                setState={setState}
            />
        );

        it('for name', () => {
            tree
                .find('input[data-field="name"]')
                .simulate('change', {target: {
                    value: fullProps.name,
                }});

            expect(setState).toBeCalledWith({
                name: fullProps.name,
            });
        });

        it('for id', () => {
            tree
                .find('input[data-field="id"]')
                .simulate('change', {target: {
                    value: fullProps.id,
                }});

            expect(setState).toBeCalledWith({
                id: fullProps.id,
            });
        });

        it('for date', () => {
            tree
                .find('input[data-field="date"]')
                .simulate('change', {target: {
                    value: fullProps.date,
                }});

            expect(setState).toBeCalledWith({
                date: fullProps.date,
            });
        });

        it('for dm_name', () => {
            tree
                .find('input[data-field="dm_name"]')
                .simulate('change', {target: {
                    value: fullProps.dm_name,
                }});

            expect(setState).toBeCalledWith({
                dm_name: fullProps.dm_name,
            });
        });

        it('for dm_dci', () => {
            tree
                .find('input[data-field="dm_dci"]')
                .simulate('change', {target: {
                    value: fullProps.dm_dci,
                }});

            expect(setState).toBeCalledWith({
                dm_dci: fullProps.dm_dci,
            });
        });
    });
});
