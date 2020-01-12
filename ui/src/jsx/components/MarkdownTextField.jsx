import React from 'react';
import PropTypes from 'prop-types';
import {
    isEmpty,
} from 'lodash/fp';
import MDReactComponent from 'markdown-react-js';

import utils from './../utils.jsx';
import LazyComponent from './LazyComponent.jsx';

import '../../sass/_markdown-textedit.scss';

export class MarkdownTextField extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            hovering: false,
        };
        this.onChange = this.onChange.bind(this);
        this.refTextarea = this.refTextarea.bind(this);
        this.setEditing = this.setEditing.bind(this);
        this.unsetEditing = this.unsetEditing.bind(this);
        this.setHovering = this.setHovering.bind(this);
        this.unsetHovering = this.unsetHovering.bind(this);
    }

    refTextarea(textarea) {
        this.textarea = textarea;
    }

    onChange(e) {
        this.props.setState(e.target.value);
    }

    setEditing() {
        const { editing } = this.state;
        if (editing) {
            return;
        }
        this.setState(
            { editing: true },
            () => this.textarea.focus()
        );
    }

    unsetEditing() {
        this.setState( { editing: false } );
    }

    setHovering() {
        this.setState({ hovering: true });
    }

    unsetHovering() {
        this.setState({ hovering:false });
    }

    render() {
        const { editing, hovering } = this.state;
        const {
            className, value, placeholder, rows, disabled,
        } = this.props;
        const style = utils.makeStyle(
            {
                "edit": !disabled && (editing || hovering),
                "preview": disabled || !(editing || hovering),
            },
            [
                "markdown-textedit",
                className,
            ]
        );

        if (disabled) {
            return (
                <div className={style}>
                    <MDReactComponent
                        className="markdown-textedit__preview"
                        text={value || ''}
                    />
                </div>
            );
        }

        return (
            <div
                className={style}
                onClick={this.setEditing}
                onMouseEnter={this.setHovering}
                onMouseLeave={this.unsetHovering}
            >
                {(
                    !editing
                    && isEmpty(value)
                    && !isEmpty(placeholder)
                ) ? (
                    <span className="markdown-textedit__placeholder">
                        {placeholder}
                    </span>
                ) : null}
                <textarea
                    className="nice-form-control"
                    value={value}
                    rows={rows}
                    ref={(textarea) => {
                        this.textarea = textarea;
                    }}
                    placeholder={placeholder}
                    onChange={this.onChange}
                    onFocus={this.setEditing}
                    onBlur={this.unsetEditing}
                />
                <MDReactComponent
                    className="markdown-textedit__preview"
                    text={value || ''}
                />
            </div>
        );
    }
}

MarkdownTextField.propTypes = {
    setState: PropTypes.func.isRequired,
    rows: PropTypes.number,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
};

MarkdownTextField.defaultProps = {
    rows: 8,
    disabled: false,
    className: '',
    placeholder: '',
    value: '',
};

export default MarkdownTextField;
