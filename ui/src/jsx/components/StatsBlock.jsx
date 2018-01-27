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
            let bare = _.assign({}, this.props.bare);
            _.map(
                this.state.improvement,
                inc => {
                    bare[inc] -= 1;
                }
            );
            this.sendUpdate({bare});
        }
    }

    getRange() {
        return _.map(
            _.range(1, this.props.maxBare + 1),
            (i) => {
                return {code: i, label: i};
            }
        );
    }

    sendUpdate(update={}) {
        const {
            bare, bonus, base, modifiers,
            statistics,
            setState
            } = this.props;
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

        this.props.statistics.map((stat) => {
            stat = stat.code;
            props.base[stat] = props.bare[stat]
                + (_.sum(props.bonus[stat] || [0]));

            props.modifiers[stat] = Math.floor(
                (props.base[stat] - 10) / 2
            );
        });

        if (!_.isEqual(props.base, base)) {
            this.props.setState(props);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {bare, bonus, base, modifiers} = nextProps;
        this.sendUpdate({bare, bonus, base, modifiers});
    }

    changeBareStat(stat, value) {
        let bare = _.assign(
            {},
            this.props.bare,
            {[stat]: value}
        );
        this.sendUpdate({bare});
    }

    increaseStat(index, stat) {
        let improvement = _.extend([], this.state.improvement);
        let bare = _.assign({}, this.props.bare);
        if (improvement[index]) {
            bare[ improvement[index] ] -= 1;
        }
        bare[ stat ] += 1;
        improvement[index] = stat;

        this.setState(
            {improvement},
            () => this.sendUpdate({bare})
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
        let spent = this._spent();
        spent -= this._cost(this.props.bare[stat]);
        spent += this._cost(item.code);
        return (
            (this.props.budget - spent) < 0
        );
    }

    renderHeader() {
        return <thead>
            <tr>
                <th>Statistic</th>
                <th>Base</th>
                {this.props.bonus
                    ? <th>Bonus</th>
                    : null
                }
                {this.props.increase
                    ? <th colSpan={this.props.increase}>Increase</th>
                    : null
                }
                <th>Final</th>
                <th>Modifier</th>
            </tr>
        </thead>
    }

    renderIncrease(index, stat) {
        const selected = this.state.improvement[index] == stat;
        const disabled = !selected && this.props.base[stat] >= 20;
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
        return <tr key={code} className="text-align-center">
            <th>{stat.label}</th>
            <td>
                {this.props.editBase
                    ? <SingleSelect
                        heading={stat.label}
                        description={stat.description}
                        items={this.getRange()}
                        setState={(value) => this.changeBareStat(code, value)}
                        isDisabled={(item) => this.isDisabled(code, item)}
                        selected={this.props.bare[code]} />
                    : this.props.bare[code]
                }
            </td>
            {this.props.bonus
                ? <td>
                    <Bonus bonus={_.sum(this.props.bonus[code])} />
                </td>
                : null
            }
            {_.times(this.props.increase,
                (index) => this.renderIncrease(index, code)
            )}
            <td>{this.props.base[code]}</td>
            <td>
                <Bonus bonus={this.props.modifiers[code]} />
            </td>
        </tr>
    }

    renderBudget() {
        return <tr key="budget" className="text-align-center">
            <th>Budget</th>
            <td>{this.props.budget - this._spent()}</td>
            <td colSpan={
                2
                + (this.props.bonus ? 1 : 0)
                + (this.props.increase || 0)
            }></td>
        </tr>
    }

    render() {
        if (!this.props.statistics) {
            return null;
        }

        return <table className="nice-table condensed bordered">
            {this.renderHeader()}
            <tbody>
                {this.props.statistics
                    .map((stat) => this.renderRow(stat))
                }
                {this.props.budget
                    ? this.renderBudget()
                    : null
                }
            </tbody>
        </table>;
    }
}

StatsBlock.defaultProps = {
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
