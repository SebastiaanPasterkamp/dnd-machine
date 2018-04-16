import React from 'react';
import Reflux from 'reflux';
import PropTypes from 'prop-types';
import _ from 'lodash';

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
        if (this.state.improvement.length) {
            let bonus = _.assign({}, this.props.bonus || {});
            _.forEach(
                this.state.improvement,
                inc => {
                    bonus[ old ] = _.dropRight(bonus[ old ]);
                }
            );
            this.sendUpdate({bonus});
        }
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
                bare: bare,
                bonus: bonus,
                base: _.assign({}, base),
                modifiers: _.assign({}, modifiers),
            },
            update
        );

        _.forEach(statistics, stat => {
            stat = stat.code;
            props.base[stat] = (props.bare[stat] || 0)
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
        let bare = _.assign(
            {},
            this.props.bare,
            {[stat]: value}
        );
        this.sendUpdate({ bare });
    }

    increaseStat(index, stat) {
        let improvement = _.clone(this.state.improvement);
        let bonus = _.assign({}, this.props.bonus);
        if (improvement[index]) {
            const old = improvement[index];
            bonus[ old ] = _.dropRight(bonus[ old ]);
        }
        bonus[ stat ] = bonus[ stat ].concat([1]);
        improvement[index] = stat;

        this.setState(
            {improvement},
            () => this.sendUpdate({ bonus })
        );
    }

    _cost(value) {
        return (value - 8) + Math.max(0, value - 13);
    }

    _spent() {
        return _.reduce(
            this.props.bare,
            (result, value, key) => {
                return result + this._cost(value)
            },
            0
        );
    }

    isDisabled(stat, item) {
        const { budget, bare } = this.props;
        if (!budget) {
            return false;
        }
        let spent = this._spent();
        spent -= this._cost(bare[stat]);
        spent += this._cost(item.code);
        return (
            (budget - spent) < 0
        );
    }

    renderHeader() {
        const { bonus, increase } = this.props;

        return <thead>
            <tr>
                <th>Statistic</th>
                <th>Base</th>
                {bonus
                    ? <th>Bonus</th>
                    : null
                }
                {increase
                    ? <th colSpan={increase}>Increase</th>
                    : null
                }
                <th>Final</th>
                <th>Modifier</th>
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
            editBase, base, bare, bonus, modifiers, increase
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
            {bonus
                ? <td>
                    <Bonus bonus={_.sum(bonus[code])} />
                </td>
                : null
            }
            {_.times(increase,
                (index) => this.renderIncrease(index, code)
            )}
            <td>{base[code]}</td>
            <td>
                <Bonus bonus={modifiers[code]} />
            </td>
        </tr>
    }

    renderBudget() {
        const { budget, bonus = 0, increase = 0 } = this.props;

        if (!budget) {
            return null;
        }

        return <tr key="budget" className="text-align-center">
            <th>Budget</th>
            <td>{budget - this._spent()}</td>
            <td colSpan={
                2
                + (bonus ? 1 : 0)
                + increase
            }></td>
        </tr>
    }

    render() {
        const { statistics } = this.props;

        if (!statistics) {
            return null;
        }

        return <table className="nice-table condensed bordered">
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
