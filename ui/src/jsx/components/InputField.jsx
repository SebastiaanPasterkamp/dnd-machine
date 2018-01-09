import React from 'react';
import LazyComponent from './LazyComponent.jsx';

export class InputField extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            float: false
        };
    }

    onChange(value) {
        if (this.props.type == 'float') {
            let float = (
                value.length
                && value.indexOf('.') == (value.length - 1)
            );
            if (float != this.state.float) {
                this.setState({float});
            }
            value = parseFloat(value) || null;
        }
        if (this.props.type == 'number') {
            value = parseInt(value) || null;
        }
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
            value={
                (this.props.value || '')
                + (this.state.float ? '.' : '')
            }
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
