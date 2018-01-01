import React from 'react';
import LazyComponent from './LazyComponent.jsx';

export class InputField extends LazyComponent
{
    onChange(value) {
        this.props.setState(value);
    }

    onKeyPress(key) {
        if (key === 'Enter') {
            this.props.onEnter();
        }
    }

    render() {
        return <input
            className="nice-form-control"
            type={this.props.type || "text"}
            value={this.props.value || ''}
            disabled={this.props.disabled || false}
            placeholder={this.props.placeholder || ''}
            onChange={(e) => this.onChange(e.target.value)}
            onKeyPress={(this.props.onEnter || false)
                ? (e) => this.onKeyPress(e.key)
                : null
            }
            />;
    }
}

InputField.defaultProps = {
    setState: (value) => {
        console.log(['InputField', value]);
    }
};

export default InputField;
