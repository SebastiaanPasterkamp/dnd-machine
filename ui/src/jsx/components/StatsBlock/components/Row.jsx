import React from 'react';
import PropTypes from 'prop-types';
import {
    isNumber,
    sum,
    times,
} from 'lodash/fp';

import { memoize } from '../../../utils';

import Bonus from '../../Bonus';
import InputField from '../../InputField';
import ToolTip from '../../ToolTip';

export class Row extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.memoize = memoize.bind(this);
        this.onBareChange = this.onBareChange.bind(this);
        this.revertValue = this.revertValue.bind(this);
    }

    onBareChange(bare) {
        const { id, onBareChange, minBare, maxBare } = this.props;
        this.setState({ bare });
        if (isNumber(bare)) {
            onBareChange(id, bare);
        }
    }

    onIncreaseChange(index) {
        return this.memoize(`stats-increase-${index}`, () => {
            const { id, onIncreaseChange } = this.props;
            onIncreaseChange(index, id);
        });
    }

    revertValue() {
        const { bare } = this.props;
        if (bare !== this.state.bare) {
            this.setState({ bare });
        }
    }

    render() {
        const {
            id, name, description, base, bare, bonus, modifier,
            increase, improvement, showBonus, showFinal, editBase, minBare, maxBare,
        } = this.props;
        const { bare: stateBare = bare } = this.state;

        return (
            <tr key={id} className="text-align-center">
                <th>
                    <ToolTip content={description}>
                        {name}
                    </ToolTip>
                </th>

                <td>
                    {editBase ? (
                        <InputField
                            type="number"
                            min={minBare}
                            max={maxBare}
                            value={stateBare || ''}
                            onBlur={this.revertValue}
                            className={stateBare === bare ? 'good' : 'bad'}
                            setState={this.onBareChange}
                            selected={bare}
                        />
                    ) : bare}
                </td>

                {times(
                    index => (
                        <td key={id + '-' + index}>
                            <input
                                type="radio"
                                name={'stats-increase-' + index}
                                checked={improvement[index] === id}
                                disabled={improvement[index] !== id && base >= 20}
                                onChange={this.onIncreaseChange(index)}
                            />
                        </td>
                    )
                )(increase)}

                {showBonus ? (
                    <td>
                        <Bonus bonus={sum(bonus)} />
                    </td>
                ) : null}

                {showFinal ? (
                    <td>
                        {base}
                    </td>
                ) : null}

                <td>
                    <Bonus bonus={modifier} />
                </td>
            </tr>
        );
    }
};

Row.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    bare: PropTypes.number,
    base: PropTypes.number,
    bonus: PropTypes.arrayOf(PropTypes.number),
    modifier: PropTypes.number,
    selectRange: PropTypes.arrayOf(PropTypes.object),
    increase: PropTypes.number,
    improvement: PropTypes.arrayOf(PropTypes.string),
    editBase: PropTypes.bool,
    showBonus: PropTypes.bool,
    showFinal: PropTypes.bool,
    onBareChange: PropTypes.func.isRequired,
    onIncreaseChange: PropTypes.func.isRequired,
};

Row.defaultProps = {
    description: '',
    base: 8,
    bare: 8,
    bonus: [],
    modifier: -1,
    increase: 0,
    improvement: [],
    selectRange: [],
    showBonus: false,
    showFinal: false,
};

export default Row;
