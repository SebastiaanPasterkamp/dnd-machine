import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import _ from 'lodash';

import StatsBlock from '../StatsBlock';

describe('Component: StatsBlock', () => {
    const props = _.reduce(
        [
            'strength', 'dexterity', 'constitution',
            'intelligence', 'wisdom', 'charisma'
        ], (props, stat) => {
            props.statistics.push({
                id: stat,
                name: stat,
                description: stat
            });
            props.bare[stat] = 12;
            props.bonus[stat] = [1, 2];
            props.base[stat] = 12;
            props.modifiers[stat] = -1;
            return props;
        },
        {
            statistics: [],
            bare: {},
            bonus: {},
            base: {},
            modifiers: {}
        }
    );

    it('should render with minimum props', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <StatsBlock.WrappedComponent
                {...props}
                statistics={undefined}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show stat block editor', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <StatsBlock
                {...props}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show increase options', () => {
        const tree = renderer.create(
            <StatsBlock
                {...props}
                increase={2}
                editBase={false}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    describe('when editing', () => {
        it('should recompute after base edits', () => {
            const onSetState = jest.fn();
            const onBonusChange = jest.fn();
            const onManualChange = jest.fn();
            const wrapper = mount(
                <StatsBlock
                    {...props}
                    budget={35}
                    setState={onSetState}
                    bonusChange={onBonusChange}
                    manualChange={onManualChange}
                />
            );

            expect(onSetState).not.toBeCalled();
            expect(onBonusChange).not.toBeCalled();
            expect(onManualChange).not.toBeCalled();

            wrapper.find('.stats-block input[type="number"]').at(1).simulate(
                'change', {target: {value: '15'}}
            );

            expect(onSetState.mock.calls).toMatchSnapshot();
            expect(onBonusChange).not.toBeCalled();
            expect(onManualChange).toBeCalledWith({
                bare: { ...props.bare, dexterity: 15 }
            });

            onSetState.mockClear();
            onManualChange.mockClear();
            wrapper.find('.stats-block input[type="number"]').at(1).simulate(
                'change', {target: {value: '9000'}}
            );

            expect(onSetState).not.toBeCalled();
            expect(onBonusChange).not.toBeCalled();
            expect(onManualChange).not.toBeCalled();
        });

        it('should recompute after selecting an increase', () => {
            const onSetState = jest.fn();
            const onBonusChange = jest.fn();
            const onManualChange = jest.fn();
            const wrapper = mount(
                <StatsBlock
                    {...props}
                    increase={2}
                    setState={onSetState}
                    bonusChange={onBonusChange}
                    manualChange={onManualChange}
                />
            );

            expect(onSetState).not.toBeCalled();
            expect(onBonusChange).not.toBeCalled();
            expect(onManualChange).not.toBeCalled();

            wrapper.find('.stats-block input[type="radio"]').at(0).simulate(
                'change', {target: {checked: true}}
            );

            expect(onBonusChange).toBeCalledWith({strength: 1});
            expect(onManualChange).toBeCalledWith({
                improvement: ["strength"],
            });
            expect(onSetState.mock.calls).toMatchSnapshot();

            wrapper.setProps({
                bonus: {
                    ...props.bonus,
                    strength: [ ... props.bonus.strength, 1 ],
                },
            });

            onSetState.mockClear();
            onManualChange.mockClear();
            wrapper.find('.stats-block input[type="radio"]').at(1).simulate(
                'change', {target: {checked: true}}
            );

            expect(onBonusChange).toBeCalledWith({strength: 2});
            expect(onManualChange).toBeCalledWith({
                improvement: ["strength", "strength"],
            });
            expect(onSetState.mock.calls).toMatchSnapshot();
        });
    });
});
