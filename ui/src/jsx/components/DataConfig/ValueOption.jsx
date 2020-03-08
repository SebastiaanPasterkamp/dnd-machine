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
            name, path, value, canBeHidden, hidden,
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
                    <ToggleSwitch
                        checked={hidden}
                        onChange={this.onFieldChange('hidden')}
                        label="Hidden"
                    />
                ) : null}

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

                <ControlGroup label="Value">
                    <MarkdownTextField
                        placeholder="Value..."
                        value={`${value}`}
                        className="small"
                        setState={this.onValueChange}
                    />
                </ControlGroup>
            </FieldSet>
        );
    }
};

ValueOption.propTypes = {
    type: PropTypes.oneOf(['value']),
    path: PropTypes.string,
    value: PropTypes.any,
    setState: PropTypes.func.isRequired,
    name: PropTypes.string,
    hidden: PropTypes.bool,
    canBeHidden: PropTypes.bool,
};

ValueOption.defaultProps = {
    type: 'value',
    value: '',
    name: '',
    hidden: false,
    canBeHidden: true,
};

export default ValueOption;
