import React from 'react';
import PropTypes from 'prop-types';
import {
    filter,
    map,
} from 'lodash/fp';

import utils from '../utils.jsx';

import LazyComponent from './LazyComponent.jsx';

export class InputField extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            isFloat: false,
            style: 'nice-form-control',
        };
        this.onPaste = this.onPaste.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const { className } = props;
        const style = utils.makeStyle({
                [className]: className,
            }, ['nice-form-control']
        );
        if (style !== state.style) {
            return { style };
        }
        return null;
    }

    typeCast(value='', remember=true) {
        const { type = 'text' } = this.props;
        const { isFloat } = this.state;

        if (type === 'float') {
            const float = (
                value.length > 0
                && value.indexOf('.') === (value.length - 1)
            );
            if (remember && float !== isFloat) {
                this.setState({ isFloat: float });
            }
            return parseFloat(value) || null;
        }

        if (type === 'number') {
            return parseInt(value) || null;
        }

        return value;
    }

    onChange = (e) => {
        const { setState } = this.props;
        const value = this.typeCast(e.target.value);
        setState(value);
    }

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.onEnter(e);
        }
    }

    onPaste(e) {
        const { onPaste, setState } = this.props;
        if (!onPaste) {
            return;
        }
        e.preventDefault();

        const rawValues = e.clipboardData
            .getData('text/plain')
            .split(/\s*\n\s*/);

        const values = map(
            value => this.typeCast(value, false)
        )(
            filter(
                value => (value && value.length > 0)
            )(rawValues)
        );
        onPaste(values);
    }

    render() {
        const {
            value, type, className, disabled, placeholder, onEnter,
            setState, inputRef, onPaste, ...props
        } = this.props;
        const { isFloat, style } = this.state;

        if (onPaste) {
            props.onPaste = this.onPaste;
        }

        return (
            <input
                className={style}
                type={type}
                value={isFloat ? `${value}.` : value}
                disabled={disabled}
                placeholder={placeholder}
                ref={inputRef}
                {...props}
                onChange={this.onChange}
                onKeyPress={onEnter ? this.onKeyPress : null}
            />
        );
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
    onPaste: PropTypes.func,
    type: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onEnter: PropTypes.func,
    placeholder: PropTypes.string,
};

export default InputField;
