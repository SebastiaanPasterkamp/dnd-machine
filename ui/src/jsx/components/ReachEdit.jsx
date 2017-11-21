import React from 'react';
import _ from 'lodash';

import LazyComponent from './LazyComponent.jsx';

import ControlGroup from './ControlGroup.jsx';
import InputField from './InputField.jsx';

export class ReachEdit extends LazyComponent
{
    constructor(props) {
        super(props);
    }

    onFieldChange(field, value) {
        let state = {
            min: this.props.min,
            max: this.props.max
        };
        state[field] = value;
        this.props.setState(state);
    }

    render() {
        return <ControlGroup labels={["Reach", "ft.", "ft."]}>
            <InputField
                placeholder="Normal..."
                value={this.props.min || ''}
                setState={(value) => {
                    this.onFieldChange('min', parseInt(value));
                }} />
            <InputField
                placeholder="Disadvantage..."
                value={this.props.max || ''}
                setState={(value) => {
                    this.onFieldChange('max', parseInt(value));
                }} />
        </ControlGroup>;
    }
}

ReachEdit.defaultProps = {
    setState: (value) => {
        console.log(['ReachEdit', value]);
    }
};

export default ReachEdit;
