import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { AdventureGold } from '../components/AdventureGold';

describe('AdventureGold', () => {
    const fullProps = {
        label: "Example Gold",
        starting: {
            sp: 20,
            gp: 30,
        },
        earned: {
            cp: 10,
            sp: 5,
        },
        total: {
            cp: 10,
            sp: 25,
            gp: 30,
        },
        disabled: true,
        className: "example-gold",
    };

    it('should render with minimum props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <AdventureGold
                setState={setState}
                label={fullProps.label}
            />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <AdventureGold
                setState={setState}
                {...fullProps}
            />
        );

        expect(tree).toMatchSnapshot();
    });

    describe('should emit change', () => {
        const setState = jest.fn();

        const tree = mount(
            <AdventureGold
                setState={setState}
                label={fullProps.label}
                starting={fullProps.starting}
            />
        );

        it('for copper, a new coin', () => {
            tree
                .find('button')
                .simulate('click');
            tree
                .find('li[data-value="cp"] a')
                .simulate('click');

            expect(setState).toBeCalledWith({
                starting: fullProps.starting,
                earned: {
                    cp: 1,
                },
                total: {
                    cp: 1,
                    sp: 20,
                    gp: 30,
                },
            });

            tree.setProps({ earned: { cp: 1 } });

            tree
                .find('input[type="number"]')
                .simulate('change', {target: {
                    value: fullProps.earned.cp.toString(),
                }});
            expect(setState).toBeCalledWith({
                starting: fullProps.starting,
                earned: {
                    cp: 10,
                },
                total: {
                    cp: 10,
                    sp: 20,
                    gp: 30,
                },
            })

            expect(tree.state()).toMatchSnapshot();
        });

        it('for silver, an existing coin', () => {
            tree.setProps({
                earned: {
                    sp: 0,
                }
            });
            setState.mockReset();
            tree
                .find('input[type="number"]')
                .simulate('change', {target: {
                    value: fullProps.earned.sp.toString(),
                }});
            expect(setState).toBeCalledWith({
                starting: fullProps.starting,
                earned: {
                    sp: fullProps.earned.sp
                },
                total: {
                    sp: 25,
                    gp: 30,
                },
            })

            expect(tree.state()).toMatchSnapshot();
        });
    });
});
