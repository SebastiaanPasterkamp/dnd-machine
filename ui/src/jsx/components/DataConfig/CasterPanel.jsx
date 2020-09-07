import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
    range,
} from 'lodash/fp';

import { memoize } from '../../utils';

import ListDataWrapper from '../../hocs/ListDataWrapper';

import ControlGroup from '../ControlGroup';
import InputField from '../InputField';
import Panel from '../Panel';
import SingleSelect from '../SingleSelect';

import { toDotCase } from './utils';

export const casterRanking = [
    { name: "Not a magic user", id: 0 },
    { name: "Full Caster", id: 1 },
    { name: "Half Caster", id: 2 },
    { name: "Third Caster", id: 3 },
];

export class CasterPanel extends React.Component
{
    constructor(props) {
        super(props);

        this.levels = range(0, 20);
        this.slots = range(0, 9);

        this.onFieldChange = this.onFieldChange.bind(this);
        this.onCellChange = this.onCellChange.bind(this);
        this.onSlotsChange = this.onSlotsChange.bind(this);
        this.memoize = memoize.bind(this);
    }

    onFieldChange(field) {
        return this.memoize(field, value => {
            const { setState } = this.props;
            setState({ [field]: value });
        });
    }

    onCellChange(field, level) {
        return this.memoize(`${field}-${level}`, value => {
            const { setState, [field]: orig } = this.props;
            const update = [...orig];
            value = parseInt(value);
            update[level] = isNaN(value) ? undefined : value;
            setState({ [field]: update });
        });
    }

    onSlotsChange(level, slot) {
        return this.memoize(`slots-${level}-${slot}`, value => {
            const { setState, slots: orig = [] } = this.props;
            const slots = [...orig];
            slots[level] = orig[level] ? [...orig[level]] : [];
            value = parseInt(value);
            slots[level][slot] = isNaN(value) ? undefined : value;
            setState({ slots });
        });
    }

    render() {
        const {
            casting_stat,
            max_cantrips_formula, max_cantrips,
            max_known_formula, max_known,
            max_prepared_formula, slots,
            statistics, configType,
        } = this.props;

        return (
            <Panel
                key="caster-panel"
                className="class-edit__caster-panel"
                header="Caster Table"
            >
                <ControlGroup label="Casting Stat">
                    <SingleSelect
                        selected={casting_stat}
                        items={statistics}
                        setState={this.onFieldChange('casting_stat')}
                    />
                </ControlGroup>

                <ControlGroup label="Max. Known cantrips formula">
                    <InputField
                        placeholder={`max(1, ${toDotCase(['sub', configType, 'level'])} + ${toDotCase(['statistics', 'modifiers', casting_stat])})`}
                        value={max_cantrips_formula}
                        setState={this.onFieldChange('max_cantrips_formula')}
                    />
                </ControlGroup>

                <ControlGroup label="Max. known spells Formula">
                    <InputField
                        placeholder={`4 + 2 * ${toDotCase(['sub', configType, 'level'])}`}
                        value={max_known_formula}
                        disabled={!!max_prepared_formula}
                        setState={this.onFieldChange('max_known_formula')}
                    />
                </ControlGroup>

                <ControlGroup label="Max. prepared spells formula">
                    <InputField
                        placeholder={`max(1, ${toDotCase(['statistics', 'modifiers', casting_stat])} + floor(${toDotCase(['sub', configType, 'level'])} / 2.0))`}
                        value={max_prepared_formula}
                        disabled={!!max_known_formula}
                        setState={this.onFieldChange('max_prepared_formula')}
                    />
                </ControlGroup>

                <table className="nice-table condensed bordered">
                    <thead>
                        <tr>
                            <th rowSpan={2} className="text-align-center">
                                Level
                            </th>
                            {max_cantrips_formula ? null : (
                                <th rowSpan={2} className="rotate">
                                    <div>Cantrips<br/>Known</div>
                                </th>
                            )}
                            {max_known_formula || max_prepared_formula ? null : (
                                <th rowSpan={2} className="rotate">
                                    <div>Spells<br/>Known</div>
                                </th>
                            )}
                            <th colSpan={9} className="text-align-center">
                                &mdash; Spell Slots per Spell Level &mdash;
                            </th>
                        </tr>
                        <tr>
                            <th>1st</th>
                            <th>2nd</th>
                            <th>3rd</th>
                            <th>4th</th>
                            <th>5th</th>
                            <th>6th</th>
                            <th>7th</th>
                            <th>8th</th>
                            <th>9th</th>
                        </tr>
                    </thead>
                    <tbody>
                        {map(
                            (level) => (
                                <tr key={`level-${level}`}>
                                    <td className="text-align-center">{level+1}</td>

                                    {max_cantrips_formula ? null : (
                                        <td>
                                            <InputField
                                                placeholder=""
                                                value={max_cantrips[level] || ''}
                                                setState={this.onCellChange('max_cantrips', level)}
                                            />
                                        </td>
                                    )}
                                    {max_known_formula || max_prepared_formula ? null : (
                                        <td>
                                            <InputField
                                                placeholder=""
                                                value={max_known[level] || ''}
                                                setState={this.onCellChange('max_known', level)}
                                            />
                                        </td>
                                    )}
                                    {map(
                                        (slot) => (
                                            <td key={`${level}-${slot}`}>
                                                <InputField
                                                    placeholder=""
                                                    value={slots[level] ? (slots[level][slot] || '') : ''}
                                                    setState={this.onSlotsChange(level, slot)}
                                                />
                                            </td>
                                        )
                                    )(this.slots)}
                                </tr>
                            )
                        )(this.levels)}
                    </tbody>
                </table>
            </Panel>
        );
    }
};


CasterPanel.propTypes = {
    setState: PropTypes.func.isRequired,
    statistics: PropTypes.arrayOf(PropTypes.object),
    casting_stat: PropTypes.string,
    max_cantrips_formula: PropTypes.string,
    max_known_formula: PropTypes.string,
    max_prepared_formula: PropTypes.string,
    max_cantrips: PropTypes.arrayOf(PropTypes.number),
    max_known: PropTypes.arrayOf(PropTypes.number),
    slots: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
};

CasterPanel.defaultProps = {
    statistics: [],
    casting_stat: '',
    max_cantrips_formula: '',
    max_known_formula: '',
    max_prepared_formula: '',
    max_cantrips: [],
    max_known: [],
    slots: [],
};

export default ListDataWrapper(
    CasterPanel,
    ['statistics'],
    'items'
);
