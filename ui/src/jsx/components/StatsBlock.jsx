import React from 'react';
import Reflux from 'reflux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    clone,
    dropRight,
    entries,
    flow,
    forEach,
    get,
    isEqual,
    map,
    range,
    reduce,
    sum,
    times,
} from 'lodash/fp';

import '../../sass/_stats-block.scss';

import ListDataWrapper from '../hocs/ListDataWrapper';

import Bonus from '../components/Bonus';
import SingleSelect from '../components/SingleSelect';

export class StatsBlock extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.state = {
            improvement: [],
        };

    }

    componentWillUnmount() {
        super.componentWillUnmount.call(this);
        const { improvement: stateImprovement } = this.state;
        const {
            bonus: oldBonus,
            improvement = stateImprovement,
        } = this.props;

        if (improvement.length) {
            let bonus = clone(oldBonus);
            forEach(
                stat => {
                    bonus[stat] = dropRight(bonus[stat]);
                }
            )(improvement);
            this.sendUpdate({ bonus });
        }
    }

    hasBonus() {
        const { bonus } = this.props;
        const total = reduce(
            (total, bonuses) => (total + sum(bonuses)),
            0
        )(bonus);
        return total > 0;
    }

    hasFinal() {
        const { increase } = this.props;
        if (increase) {
            return true;
        }
        return this.hasBonus();
    }

    getRange() {
        const { minBare, maxBare } = this.props;
        return map(
            i => ({code: i, label: i})
        )(range(minBare, maxBare + 1));
    }

    sendUpdate(update) {
        const {
            bare, bonus, base, modifiers,
            statistics, setState
        } = this.props;

        if (!statistics.length) {
            return;
        }

        let props = {
            bare,
            bonus,
            base: {...base},
            modifiers: {...modifiers},
            ...update,
        };

        forEach(
            stat => {
                stat = stat.code;
                props.bare[stat] = get(['bare', stat], props) || 8;
                props.base[stat] = props.bare[stat]
                    + sum(get(['bonus', stat], props));

                props.modifiers[stat] = Math.floor(
                    (props.base[stat] - 10) / 2
                );
            }
        )(statistics);

        if (!(
            isEqual(props.bare, bare)
            && isEqual(props.bonus, bonus)
            && isEqual(props.modifiers, modifiers)
        )) {
            setState(props);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { bare, bonus, base, modifiers } = nextProps;
        this.sendUpdate({ bare, bonus, base, modifiers });
    }

    changeBareStat(stat, value) {
        const { bare: oldBare, manualChange } = this.props;
        const bare = {
            ...oldBare,
            [stat]: value,
        };
        if (manualChange) {
            manualChange({ bare });
        }
        this.sendUpdate({ bare });
    }

    increaseStat(index, stat) {
        const { improvement: stateImprovement } = this.state
        const {
            bonus: oldBonus = {},
            bonusChange,
            manualChange,
            improvement: oldImprovement = stateImprovement,
        } = this.props;
        let improvement = [...oldImprovement];
        let bonus = clone(oldBonus);

        if (improvement[index]) {
            const old = improvement[index];
            bonus[ old ] = dropRight(bonus[old]);
        }
        bonus[ stat ] = [...get(stat, bonus), 1];
        improvement[index] = stat;

        this.setState(
            {
                improvement,
            },
            () => {
                this.sendUpdate({
                    bonus,
                    improvement,
                });

                if (manualChange) {
                    manualChange({ improvement });
                }

                if (bonusChange) {
                    const improvements = reduce(
                        (cntr, stat) => {
                            cntr[stat] = (cntr[stat] || 0) + 1;
                            return cntr;
                        },
                        {}
                    )(improvement);
                    bonusChange(improvements);
                }
            }
        );
    }

    _cost(value) {
        return (value - 8) + Math.max(0, value - 13);
    }

    _spent() {
        const {
            modifiers,
            bare,
        } = this.props;
        return flow(entries, reduce(
            (result, [mod, stat]) => (
                result + this._cost(get(stat, bare) || 8)
            ),
            0
        ))(modifiers);
    }

    isDisabled(stat, item) {
        const { budget, bare } = this.props;
        if (!budget) {
            return false;
        }
        let spent = this._spent();
        spent -= this._cost(get(stat, bare) || 8);
        spent += this._cost(item.code);
        return (
            (budget - spent) < 0
        );
    }

    renderHeader() {
        const { increase } = this.props;

        return (
            <thead>
                <tr>
                    <th>Statistic</th>
                    <th className="text-align-center">Base</th>
                    {this.hasBonus()
                        ? <th className="text-align-center">Bonus</th>
                        : null
                    }
                    {increase
                        ? <th colSpan={increase} className="text-align-center">Increase</th>
                        : null
                    }
                    {this.hasFinal()
                        ? <th className="text-align-center">Final</th>
                        : null
                    }
                    <th className="text-align-center">Modifier</th>
                </tr>
            </thead>
        );
    }

    renderIncrease(index, stat) {
        const { improvement: stateImprovement } = this.state
        const { base, improvement = stateImprovement } = this.props;
        const selected = improvement[index] == stat;
        const disabled = !selected && base[stat] >= 20;

        return (
            <td key={stat + '-' + index}>
                <input
                    type="radio"
                    name={'radio-' + index}
                    checked={selected}
                    disabled={disabled}
                    onChange={() => this.increaseStat(index, stat)}
                />
            </td>
        );
    }

    renderRow(stat) {
        const code = stat.code;
        const {
            editBase, base, bare, bonus, modifiers, increase,
        } = this.props;

        return (
            <tr key={code} className="text-align-center">
                <th>{stat.label}</th>
                <td>
                    {editBase
                        ? <SingleSelect
                            heading={stat.label}
                            description={stat.description}
                            defaultValue={8}
                            items={this.getRange()}
                            setState={(value) => this.changeBareStat(code, value)}
                            isDisabled={(item) => this.isDisabled(code, item)}
                            selected={bare[code]} />
                        : bare[code]
                    }
                </td>
                {this.hasBonus()
                    ? <td>
                        <Bonus bonus={sum(bonus[code])} />
                    </td>
                    : null
                }
                {times(index => this.renderIncrease(index, code))(increase)}
                {this.hasFinal()
                    ? <td>{base[code]}</td>
                    : null
                }
                <td>
                    <Bonus bonus={modifiers[code]} />
                </td>
            </tr>
        );
    }

    renderBudget() {
        const { budget, editBase, increase = 0 } = this.props;

        if (!budget || !editBase) {
            return null;
        }

        return (
            <tr key="budget" className="text-align-center">
                <th>Budget</th>
                <td>{budget - this._spent()}</td>
                <td colSpan={
                    2
                    + (this.hasBonus() ? 1 : 0)
                    + increase
                }></td>
            </tr>
        );
    }

    render() {
        const { statistics } = this.props;

        if (!statistics) {
            return null;
        }

        return (
            <table className="nice-table stats-block condensed bordered">
                {this.renderHeader()}
                <tbody>
                    {map(
                        stat => this.renderRow(stat)
                    )(statistics)}
                    {this.renderBudget()}
                </tbody>
            </table>
        );
    }
}

StatsBlock.defaultProps = {
    minBare: 8,
    maxBare: 30,
    budget: 0,
    editBase: true,
    increase: 0,
    bare: {},
    bonus: {},
    base: {},
    modifiers: {},
    improvement: undefined,
    statistics: [],
    setState: (selected) => {
        console.log(['StatsBlock', selected]);
    }
};

StatsBlock.propTypes = {
    bare: PropTypes.objectOf(PropTypes.number).isRequired,
    bonus: PropTypes.objectOf(
        PropTypes.arrayOf(PropTypes.number)
    ).isRequired,
    base: PropTypes.objectOf(PropTypes.number).isRequired,
    modifiers: PropTypes.objectOf(PropTypes.number).isRequired,
    improvement: PropTypes.arrayOf(PropTypes.string),

    bonusChange: PropTypes.func,
    manualChange: PropTypes.func,

    minBare: PropTypes.number,
    maxBare: PropTypes.number,
    budget: PropTypes.number,
    editBase: PropTypes.bool,
    increase: PropTypes.number,

    setState: PropTypes.func.isRequired,
};

export default ListDataWrapper(
    StatsBlock,
    ['statistics'],
    'items'
);
