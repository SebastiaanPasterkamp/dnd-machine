import React from 'react';
import LazyComponent from './LazyComponent.jsx';

export class InputField extends LazyComponent
{
    onChange(value) {
        this.props.setState(value);
    }

    render() {
        return <input
            type="text"
            className="nice-form-control"
            value={this.props.value}
            placeholder={this.props.placeholder}
            onChange={(e) => this.onChange(e.target.value)}
            />;
    }
}

InputField.defaultProps = {
    setState: (value) => {
        console.log(['InputField', value]);
    }
};

export default InputField;