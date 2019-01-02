import React from 'react';
import Reflux from 'reflux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_stats-block.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';

import Bonus from '../components/Bonus.jsx';
import SingleSelect from '../components/SingleSelect.jsx';

export class StatsBlock extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.state = {
            improvement: []
        };

    }

    componentWillUnmount() {
        const {
            bonus: oldBonus = {},
        } = this.props;
        const {
            improvement,
        } = this.state;

        if (improvement.length) {
            let bonus = _.clone(oldBonus);
            _.forEach(
                improvement,
                stat => {
                    bonus[stat] = _.dropRight(bonus[stat]);
                }
            );
            this.sendUpdate({bonus});
        }
    }

    hasBonus() {
        const { bonus = {} } = this.props;
        const total = _.reduce(
            bonus,
            (total, bonuses) => (total + _.sum(bonuses)),
            0
        );
        return total > 0;
    }

    hasFinal() {
        const { increase = 0 } = this.props;
        if (increase) {
            return true;
        }
        return this.hasBonus();
    }

    getRange() {
        const { minBare, maxBare } = this.props;
        return _.map(
            _.range(minBare, maxBare + 1),
            (i) => ({code: i, label: i})
        );
    }

    sendUpdate(update={}) {
        const {
            bare = {}, bonus = {}, base = {}, modifiers = {},
            statistics = [], setState
        } = this.props;

        if (!statistics) {
            return;
        }

        let props = _.assign(
            {},
            {
                bare,
                bonus,
                base: _.assign({}, base),
                modifiers: _.assign({}, modifiers),
            },
            update
        );

        _.forEach(statistics, stat => {
            stat = stat.code;
            props.bare[stat] = _.get(props, ['bare', stat], 8);
            props.base[stat] = props.bare[stat]
                + _.sum(_.get(props, ['bonus', stat], []));

            props.modifiers[stat] = Math.floor(
                (props.base[stat] - 10) / 2
            );
        });

        if (!_.isEqual(props.base, base)) {
            setState(props);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { bare, bonus, base, modifiers } = nextProps;
        this.sendUpdate({ bare, bonus, base, modifiers });
    }

    changeBareStat(stat, value) {
        const bare = _.assign(
            {},
            this.props.bare,
            {[stat]: value}
        );
        this.sendUpdate({ bare });
    }

    increaseStat(index, stat) {
        const {
            improvement: oldImprovement,
        } = this.state;
        const {
            bonus: oldBonus = {},
            bonusChange,
        } = this.props;
        let improvement = _.clone(oldImprovement);
        let bonus = _.clone(oldBonus);

        if (improvement[index]) {
            const old = improvement[index];
            bonus[ old ] = _.dropRight(bonus[ old ]);
        }
        bonus[ stat ] = _.concat(
            _.get(bonus, stat, []),
            [1],
        );
        improvement[index] = stat;

        this.setState(
            {
                improvement,
            },
            () => {
                this.sendUpdate({
                    bonus,
                });

                if (bonusChange) {
                    bonusChange(
                        bonus
                    );
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
        return _.reduce(
            modifiers,
            (result, mod, stat) => (
                result + this._cost(_.get(bare, stat, 8))
            ),
            0
        );
    }

    isDisabled(stat, item) {
        const { budget, bare } = this.props;
        if (!budget) {
            return false;
        }
        let spent = this._spent();
        spent -= this._cost(_.get(bare, stat, 8));
        spent += this._cost(item.code);
        return (
            (budget - spent) < 0
        );
    }

    renderHeader() {
        const { increase } = this.props;

        return <thead>
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
    }

    renderIncrease(index, stat) {
        const { base } = this.props;
        const { improvement } = this.state;
        const selected = improvement[index] == stat;
        const disabled = !selected && base[stat] >= 20;

        return <td key={stat + '-' + index}>
            <input
                type="radio"
                name={'radio-' + index}
                checked={selected}
                disabled={disabled}
                onChange={() => this.increaseStat(index, stat)}
                />
        </td>
    }

    renderRow(stat) {
        const code = stat.code;
        const {
            editBase, base, bare, bonus = {}, modifiers, increase,
        } = this.props;

        return <tr key={code} className="text-align-center">
            <th>{stat.label}</th>
            <td>
                {editBase
                    ? <SingleSelect
                        heading={stat.label}
                        description={stat.description}
                        items={this.getRange()}
                        setState={(value) => this.changeBareStat(code, value)}
                        isDisabled={(item) => this.isDisabled(code, item)}
                        selected={bare[code]} />
                    : bare[code]
                }
            </td>
            {this.hasBonus()
                ? <td>
                    <Bonus bonus={_.sum(bonus[code])} />
                </td>
                : null
            }
            {_.times(increase,
                (index) => this.renderIncrease(index, code)
            )}
            {this.hasFinal()
                ? <td>{base[code]}</td>
                : null
            }
            <td>
                <Bonus bonus={modifiers[code]} />
            </td>
        </tr>
    }

    renderBudget() {
        const { budget, increase = 0 } = this.props;

        if (!budget) {
            return null;
        }

        return <tr key="budget" className="text-align-center">
            <th>Budget</th>
            <td>{budget - this._spent()}</td>
            <td colSpan={
                2
                + (this.hasBonus() ? 1 : 0)
                + increase
            }></td>
        </tr>
    }

    render() {
        const { statistics } = this.props;

        if (!statistics) {
            return null;
        }

        return <table className="nice-table stats-block condensed bordered">
            {this.renderHeader()}
            <tbody>
                {_.map(statistics, stat => this.renderRow(stat))}
                {this.renderBudget()}
            </tbody>
        </table>;
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
