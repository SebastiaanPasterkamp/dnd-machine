import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Row from '../components/Row';

describe('Component: Row', () => {
    const fullProps = {
        id: 'wisdom',
        name: 'Wisdom',
        description: 'Something',
        base: 13,
        bare: 10,
        bonus: [2, 1],
        modifier: 1,
        increase: 2,
        improvement: ['wisdom', 'strength'],
        showBonus: true,
        showFinal: true,
        editBase: true,
        minBare: 8,
        maxBare: 15,
    };

    it('should render with minimum props', () => {
        const onBareChange = jest.fn();
        const onIncreaseChange = jest.fn();
        const tree = renderer.create(
            <Row
                id={fullProps.id}
                name={fullProps.name}
                onBareChange={onBareChange}
                onIncreaseChange={onIncreaseChange}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const onBareChange = jest.fn();
        const onIncreaseChange = jest.fn();
        const tree = renderer.create(
            <Row
                {...fullProps}
                onBareChange={onBareChange}
                onIncreaseChange={onIncreaseChange}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    describe('when editing', () => {
        it('should recompute after base edits', () => {
            const onBareChange = jest.fn();
            const onIncreaseChange = jest.fn();
            const wrapper = mount(
                <table>
                    <tbody>
                        <Row
                            {...fullProps}
                            onBareChange={onBareChange}
                            onIncreaseChange={onIncreaseChange}
                        />
                    </tbody>
                </table>
            );

            expect(onBareChange).not.toBeCalled();
            expect(onIncreaseChange).not.toBeCalled();

            wrapper.find('input[type="number"]').simulate(
                'change', {target: {value: '15'}}
            );

            expect(onBareChange).toBeCalledWith(fullProps.id, 15);
            expect(onIncreaseChange).not.toBeCalled();

            wrapper.find('input[type="number"]').simulate(
                'change', {target: {value: '9000'}}
            );

            expect(onBareChange).toBeCalledWith(fullProps.id, 9000);
            expect(onIncreaseChange).not.toBeCalled();

            wrapper.find('input[type="number"]').simulate('blur');
        });

        it('should recompute after selecting increase', () => {
            const onBareChange = jest.fn();
            const onIncreaseChange = jest.fn();
            const wrapper = mount(
                <table>
                    <tbody>
                        <Row
                            {...fullProps}
                            onBareChange={onBareChange}
                            onIncreaseChange={onIncreaseChange}
                        />
                    </tbody>
                </table>
            );

            expect(onBareChange).not.toBeCalled();
            expect(onIncreaseChange).not.toBeCalled();

            wrapper.find('input[type="radio"]').at(0).simulate(
                'change', {target: {checked: true}}
            );

            expect(onBareChange).not.toBeCalled();
            expect(onIncreaseChange).toBeCalledWith(0, fullProps.id);
        });
    });
});
