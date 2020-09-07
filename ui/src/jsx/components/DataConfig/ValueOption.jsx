import React from 'react';
import PropTypes from 'prop-types';

import { memoize } from '../../utils';

import ControlGroup from '../ControlGroup';
import FieldSet from '../FieldSet';
import InputField from '../InputField';
import MarkdownTextField from '../MarkdownTextField';
import ToggleSwitch from '../ToggleSwitch';

import { uuidv4 } from './utils';


export class ValueOption extends React.Component
{
    optionType = 'value';

    constructor(props) {
        super(props);
        const { uuid = uuidv4() } = props;
        this.state = { uuid };
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onToggleFormula = this.onToggleFormula.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.memoize = memoize.bind(this);
    }

    onFieldChange(field) {
        return this.memoize(field, value => {
            const { uuid } = this.state;
            const { setState } = this.props;
            setState({
                type: this.optionType,
                uuid,
                [field]: value,
            });
        });
    }

    onToggleFormula(field) {
        const { uuid, old_value, old_formula = '' } = this.state;
        const { setState, value, value_formula } = this.props;

        if (value_formula !== undefined) {
            this.setState({
                old_formula: value_formula,
            });
            setState({
                type: this.optionType,
                uuid,
                value: old_value,
                value_formula: undefined,
            });
        } else {
            this.setState({
                old_value: value,
            });
            setState({
                type: this.optionType,
                uuid,
                value: undefined,
                value_formula: old_formula,
            });
        }
    }

    onValueChange(value) {
        const { uuid } = this.state;
        const { setState } = this.props;
        if (value.match(/^\d+(?:\.\d+)?$/)) {
            value = parseFloat(value);
        }
        setState({
            type: this.optionType,
            uuid,
            value,
        });
    }

    render() {
        const {
            name, path, value, value_formula, canBeHidden, hidden,
        } = this.props;

        return (
            <FieldSet label="Value option">
                <ControlGroup label="Path">
                    <InputField
                        placeholder="Path..."
                        value={path}
                        type="text"
                        setState={this.onFieldChange('path')}
                    />
                </ControlGroup>

                {canBeHidden ? (
                    <ControlGroup>
                        <ToggleSwitch
                            checked={hidden}
                            onChange={this.onFieldChange('hidden')}
                            label="Hidden"
                        />
                    </ControlGroup>
                ) : null}

                <ControlGroup>
                    <ToggleSwitch
                        checked={value_formula !== undefined}
                        onChange={this.onToggleFormula}
                        label="Formula"
                    />
                </ControlGroup>

                {!(canBeHidden && hidden) ? (
                    <ControlGroup label="Label">
                        <InputField
                            placeholder="Label..."
                            value={name}
                            type="text"
                            setState={this.onFieldChange('name')}
                        />
                    </ControlGroup>
                ) : null}

                { value_formula !== undefined ? (
                    <ControlGroup label="Value formula">
                        <InputField
                            placeholder="Value formula..."
                            value={value_formula}
                            setState={this.onFieldChange('value_formula')}
                        />
                    </ControlGroup>
                ) : (
                    <ControlGroup label="Value">
                        <MarkdownTextField
                            placeholder="Value..."
                            value={`${value}`}
                            className="small"
                            setState={this.onValueChange}
                        />
                    </ControlGroup>
                )}
            </FieldSet>
        );
    }
};

ValueOption.propTypes = {
    type: PropTypes.oneOf(['value']),
    path: PropTypes.string,
    value: PropTypes.any,
    value_formula: PropTypes.string,
    setState: PropTypes.func.isRequired,
    name: PropTypes.string,
    hidden: PropTypes.bool,
    canBeHidden: PropTypes.bool,
};

ValueOption.defaultProps = {
    type: 'value',
    value: '',
    value_formula: undefined,
    name: '',
    hidden: false,
    canBeHidden: true,
};

export default ValueOption;
