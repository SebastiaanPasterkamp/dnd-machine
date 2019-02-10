import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import InputField from './InputField.jsx';
import LazyComponent from './LazyComponent.jsx';

export class CalculatorInputField extends LazyComponent
{
    constructor(props) {
        super(props);
        const {
            value: formula = '',
        } = props;
        this.state = {
            formula,
            value: props.value,
            validation: null,
        };
    }

    onChange(formula) {
        const { value, minValue, maxValue, setState } = this.props;

        if (formula === "") {
            this.setState(
                {
                    formula,
                    validation: null,
                },
                () => setState(0, formula)
            );
            return;
        }

        // incomplete, but potentially valid formula
        if (formula.match(
            /^(-|-?([0-9]+(\s|\s?[+-]\s?))+)$/
        )) {
            this.setState({
                formula,
                validation: 'warning',
            });
            return;
        }

        // invalid formula
        if (!formula.match(
            /^-?[0-9]+(\s?[+-]\s?[0-9]+)*$/
        )) {
            this.setState({
                formula,
                validation: 'bad',
            });
            return;
        }

        const calc = {
            '+': (a, b) => ( a + b ),
            '-': (a, b) => ( a - b ),
        };
        const prefix = formula.match(/^\s*-/) ? '' : '+';
        const steps = (prefix + formula)
            .replace(/\s+/g, '')
            .split(/\b/);
        const computedValue = _.reduce(
            _.range(0, steps.length - 1, 2),
            (newValue, i) => {
                return calc[ steps[i] ](
                    newValue,
                    parseInt(steps[i+1])
                );
            },
            0
        );
        const newValue = Math.min(
            maxValue === undefined ? computedValue : maxValue,
            Math.max(
                minValue === undefined ? computedValue : minValue,
                computedValue
            )
        );

        this.setState(
            {
                formula,
                validation: newValue !== computedValue
                    ? 'bad'
                    : 'good',
            },
            () => setState(newValue, formula)
        );
    }

    render() {
        const { formula, validation } = this.state;
        const { value, type, setState, minValue, maxValue, ...props } = this.props;

        return (
            <InputField
                value={formula}
                className={validation}
                min={minValue}
                max={maxValue}
                {...props}
                setState={value => this.onChange(value)}
                type="text"
            />
        );
    }
}

CalculatorInputField.defaultProps = {
    setState: (value) => {
        console.log(['CalculatorInputField', value]);
    }
};

CalculatorInputField.propTypes = _.assign({}, InputField.propTypes, {
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    setState: PropTypes.func,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
});

export default CalculatorInputField;
