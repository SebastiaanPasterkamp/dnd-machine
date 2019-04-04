import React from 'react';
import PropTypes from 'prop-types';

import CalculatorInputField from '../../../components/CalculatorInputField.jsx';
import ControlGroup from '../../../components/ControlGroup.jsx';
import InputField from '../../../components/InputField.jsx';
import Panel from '../../../components/Panel.jsx';

export class AdventureDelta extends React.PureComponent
{
    constructor(props) {
        super(props);
        this.state = {};
    }

    onChange = (earned, formula) => {
        const { starting, disabled, setState } = this.props;
        if (disabled) {
            return;
        }

        const total = starting + earned;
        this.setState(
            { formula, total },
            () => setState({ starting, earned, total })
        );
    }

    render() {
        const {
            starting, earned, total, className, label, disabled,
        } = this.props;
        const {
            formula = earned,
        } = this.state;

        return (
            <Panel
                header={label}
                className={className}
            >
                <ControlGroup label="Starting">
                    <InputField
                        placeholder="Starting..."
                        disabled={true}
                        type="number"
                        value={starting}
                    />
                </ControlGroup>
                <ControlGroup label="Earned">
                    <CalculatorInputField
                        placeholder="Earned..."
                        data-field="earned"
                        value={earned}
                        disabled={disabled}
                        setState={this.onChange}
                    />
                </ControlGroup>
                <ControlGroup label="Total">
                    <InputField
                        placeholder="Total..."
                        disabled={true}
                        type="number"
                        value={earned ? total : starting}
                    />
                </ControlGroup>
            </Panel>
        );
    }
};

AdventureDelta.propTypes = {
    setState: PropTypes.func,
    label: PropTypes.string.isRequired,
    starting: PropTypes.number,
    earned: PropTypes.number,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

AdventureDelta.defaultProps = {
    starting: 0,
    earned: 0,
    className: '',
    disabled: false,
};

export default AdventureDelta;
