import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { TreasureCheckpoints } from '../components/TreasureCheckpoints';

describe('TreasureCheckpoints', () => {
    const fullProps = {
        label: "Example TCP",
        className: "example-tcp",
        starting: {
            one: 5,
        },
        earned: {
            one: 0,
            two: 3,
        },
        total: {
            one: 5,
            two: 3,
        },
        currentTier: "two",
    };

    it('should render with minimum props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <TreasureCheckpoints
                setState={setState}
                label={fullProps.label}
            />
        );

        expect(tree).toMatchSnapshot();
    });

    describe('should honor', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <TreasureCheckpoints
                setState={setState}
                {...fullProps}
            />
        );

        beforeEach(() => setState.mockClear());

        it('max value', () => {
            wrapper
                .find('input[data-field="tier-two"]')
                .simulate('change', {target: {
                    value: "1",
                }});

            expect(wrapper).toMatchSnapshot();
            expect(setState).toBeCalledWith({
                starting: fullProps.starting,
                earned: {
                    one: 0,
                    two: 1,
                },
                total: {
                    one: 5,
                    two: 1,
                }
            });
        });

        it('min value', () => {
            wrapper
                .find('input[data-field="tier-one"]')
                .simulate('change', {target: {
                    value: "-5",
                }});

            expect(wrapper).toMatchSnapshot();
            expect(setState).toBeCalledWith({
                starting: fullProps.starting,
                earned: {
                    one: -5,
                    two: 3,
                },
                total: {
                    one: 0,
                    two: 3,
                }
            });
        });
    });

    describe('reject honor', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <TreasureCheckpoints
                setState={setState}
                {...fullProps}
            />
        );

        beforeEach(() => setState.mockClear());

        it('exceeding max value', () => {
            wrapper
                .find('input[data-field="tier-one"]')
                .simulate('change', {target: {
                    value: "1",
                }});

            expect(wrapper).toMatchSnapshot();
            expect(setState).toBeCalledWith({
                starting: fullProps.starting,
                earned: fullProps.earned,
                total: fullProps.total,
            });
        });

        it('exceeding min value', () => {
            wrapper
                .find('input[data-field="tier-one"]')
                .simulate('change', {target: {
                    value: "-6",
                }});

            expect(wrapper).toMatchSnapshot();
            expect(setState).toBeCalledWith({
                starting: fullProps.starting,
                earned: {
                    one: -5,
                    two: 3,
                },
                total: {
                    one: 0,
                    two: 3,
                },
            });
        });
    });
});