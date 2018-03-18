import React from 'react';
import PropTypes from 'prop-types';

import InputField from './InputField.jsx';
import LazyComponent from './LazyComponent.jsx';

export class CalculatorInputField extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = { };
    }

    onChange(formula) {
        const { value, minValue, maxValue, setState } = this.props;

        if (formula == '') {
            this.setState(
                {formula},
                () => setState(0, formula)
            );
        }

        // incomplete, but potentially valid formula
        if (formula.match(
            /^(-|-?([0-9]+(\s|\s?[+-]\s?))+)$/
        )) {
            this.setState({formula});
            return;
        }

        // invalid formula
        if (!formula.match(
            /^-?[0-9]+(\s?[+-]\s?[0-9]+)*$/
        )) {
            return;
        }

        const calc = {
            '+': (a, b) => maxValue == undefined
                ? ( a + b )
                : Math.min(maxValue, a + b),
            '-': (a, b) => minValue == undefined
                ? ( a - b )
                : Math.max(minValue, a - b),
        };
        const prefix = formula.match(/^\s*-/) ? '' : '+';
        const steps = (prefix + formula)
            .replace(/\s+/g, '')
            .split(/\b/);
        const newValue = _.reduce(
            _.range(0, steps.length - 1, 2),
            (newValue, i) => {
                return calc[ steps[i] ](
                    newValue,
                    parseInt(steps[i+1])
                );
            },
            0
        );
        this.setState(
            {formula},
            () => setState(newValue, formula)
        );
    }

    render() {
        const { value, type, setState, ...props } = this.props;
        const { formula = value } = this.state;

        return <InputField
            value={formula || ''}
            {...props}
            setState={value => this.onChange(value)}
            type="text"
            />;
    }
}

CalculatorInputField.defaultProps = {
    setState: (value) => {
        console.log(['CalculatorInputField', value]);
    }
};

CalculatorInputField.propTypes = _.assign({}, InputField.propTypes, {
    value: PropTypes.number,
    setState: PropTypes.func,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
});

export default CalculatorInputField;
