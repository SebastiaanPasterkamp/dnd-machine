import React from 'react';
import PropTypes from 'prop-types';
import {
    assign,
    indexOf,
    map,
    reduce,
} from 'lodash/fp';

import { memoize } from '../../../utils';

import CalculatorInputField from '../../../components/CalculatorInputField.jsx';
import ControlGroup from '../../../components/ControlGroup.jsx';
import InputField from '../../../components/InputField.jsx';
import Panel from '../../../components/Panel.jsx';

import { tierType, tierDefault } from '../extraProps';

export class TreasureCheckpoints extends React.PureComponent
{
    tiers = [ 'one', 'two', 'three', 'four' ];

    constructor(props) {
        super(props);
        this.memoize = memoize.bind(this);
    }

    onChange = (tier) => this.memoize(tier, (value) => {
        const {
            disabled,
            starting,
            earned: oldEarned,
            total: oldTotal,
            setState,
        } = this.props;
        if (disabled) {
            return;
        }
        let earned = assign({}, oldEarned);
        earned = assign(earned, {
            [tier]: value,
        });
        let total = assign({}, oldTotal);
        total = assign(total, {
            [tier]: (starting[tier] || 0) + value,
        });

        setState({ starting, earned, total });
    })

    render() {
        const {
            starting, earned, total, className, label, disabled,
            currentTier,
        } = this.props;

        return (
            <Panel
                className={className}
                header={label}
            >
            {map(tier => (
                <ControlGroup
                    key={tier}
                    className={tier === currentTier
                        ? 'current'
                        : undefined
                    }
                    labels={[
                        tier === currentTier
                            ? 'Current tier'
                            : `Tier ${tier}`,
                        "±",
                        "="
                    ]}
                >
                    <InputField
                        disabled={true}
                        type="number"
                        value={starting[tier]}
                    />
                    <CalculatorInputField
                        placeholder="Earned..."
                        value={earned[tier]}
                        disabled={disabled}
                        setState={this.onChange(tier)}
                        maxValue={currentTier === tier
                            ? undefined
                            : 0
                        }
                        minValue={(total[tier] || 0) * -1}
                    />
                    <InputField
                        placeholder="Total..."
                        disabled={true}
                        type="number"
                        value={total[tier]}
                    />
                </ControlGroup>
            ))(this.tiers)}
            </Panel>
        );
    }
};

TreasureCheckpoints.propTypes = {
    setState: PropTypes.func,
    label: PropTypes.string.isRequired,
    starting: tierType,
    earned: tierType,
    total: tierType,
    currentTier: PropTypes.oneOf([
        'one', 'two', 'three', 'four',
    ]),
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

TreasureCheckpoints.defaultProps = {
    starting: tierDefault,
    earned: tierDefault,
    total: tierDefault,
    currentTier: 'one',
    className: '',
    disabled: false,
};

export default TreasureCheckpoints;