import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';

import Bonus from '../components/Bonus.jsx';
import SingleSelect from '../components/SingleSelect.jsx';

export class StatsBlock extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.range = _.range(8, 16)
            .map((i) => {
                return {code: i, label: i}
            });
    }

    sendUpdate(update) {
        let props = _.assign(this.props, update);

        this.props.statistics.map((stat) => {
            stat = stat.name;
            props['base'][stat] = props['bare'][stat]
                + (_.sum(props['bonus'][stat] || [0]))
                + _.reduce(
                    props.improvement,
                    (total, increase) => {
                        if (increase == stat) {
                            total += 1;
                        }
                        return total;
                    }, 0
                );

            props['modifiers'][stat] = Math.floor(
                (props['base'][stat] - 10) / 2
            );
        });

        this.props.setState(update);
    }

    changeBareStat(stat, value) {
        let update = _.extend({}, this.props.bare);
        update[stat] = value;
        this.sendUpdate({
            bare: update
            });
    }

    increaseStat(index, stat) {
        let update = _.extend([], this.props.improvement);
        update[index] = stat;
        this.sendUpdate({
            improvement: update
        });
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
        const selected = this.props.improvement[index] == stat;
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
        return <tr key={stat.name} className="text-align-center">
            <th>{stat.label}</th>
            <td>
                <SingleSelect
                    heading={stat.label}
                    description={stat.description}
                    items={this.range}
                    setState={(value) => this.changeBareStat(stat.name, value)}
                    isDisabled={(item) => this.isDisabled(stat.name, item)}
                    selected={this.props.bare[stat.name]} />
            </td>
            {this.props.bonus
                ? <td>
                    <Bonus bonus={_.sum(this.props.bonus[stat.name])} />
                </td>
                : null
            }
            {_.times(this.props.increase,
                (index) => this.renderIncrease(index, stat.name)
            )}
            <td>{this.props.base[stat.name]}</td>
            <td>
                <Bonus bonus={this.props.modifiers[stat.name]} />
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
    bare: {},
    bonus: {},
    improvement: [],
    base: {},
    modifiers: {},
    setState: (selected) => {
        console.log(['StatsBlock', selected]);
    }
};

export default ListDataWrapper(
    StatsBlock,
    ['statistics'],
    'items'
);
