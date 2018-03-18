import React from 'react';
import PropTypes from 'prop-types';

import utils from '../utils.jsx';

import LazyComponent from './LazyComponent.jsx';

export class InputField extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            isFloat: false
        };
    }

    onChange(value) {
        const { type = 'text', setState } = this.props;
        const { isFloat } = this.state;

        if (type == 'float') {
            let float = (
                value.length
                && value.indexOf('.') == (value.length - 1)
            );
            if (float != isFloat) {
                this.setState({isFloat: float});
            }
            value = parseFloat(value) || null;
        }
        if (type == 'number') {
            value = parseInt(value) || null;
        }
        setState(value);
    }

    onKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.onEnter(e);
        }
    }

    render() {
        const {
            value, type, className, disabled, placeholder, onEnter,
            setState, ...props
        } = this.props;
        const { isFloat } = this.state;
        const style = utils.makeStyle({
            [className]: className
        }, ['nice-form-control']);

        return <input
            className={style}
            type={type}
            value={value + (isFloat ? '.' : '')}
            disabled={disabled}
            placeholder={placeholder}
            {...props}
            onChange={(e) => this.onChange(e.target.value)}
            onKeyPress={
                onEnter
                ? (e) => this.onKeyPress(e)
                : null
            }
            />;
    }
}

InputField.defaultProps = {
    value: '',
    setState: (value) => {
        console.log(['InputField', value]);
    }
};

InputField.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    setState: PropTypes.func,
    type: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onEnter: PropTypes.func,
    placeholder: PropTypes.string,
};

export default InputField;
