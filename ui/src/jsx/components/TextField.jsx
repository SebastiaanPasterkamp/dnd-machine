import React from 'react';
import LazyComponent from './LazyComponent.jsx';

export class TextField extends LazyComponent
{
    onChange(value) {
        this.props.setState(value);
    }

    render() {
        return <textarea
            className="nice-form-control"
            value={this.props.value}
            rows={this.props.rows}
            placeholder={this.props.placeholder}
            onChange={(e) => this.onChange(e.target.value)}
            />;
    }
}

TextField.defaultProps = {
    setState: (value) => {
        console.log(['TextField', value]);
    }
};

export default TextField;