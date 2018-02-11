import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
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
    }

    onChange(value) {
        this.props.setState(value);
    }

    setEditing(editing) {
        this.setState({editing});
    }

    setHovering(hovering) {
        this.setState({hovering});
    }

    render() {
        const {
            className, value, placeholder, rows, disabled
        } = this.props;
        const {
            editing, hovering
        } = this.state;
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

        return <div
                className={style}
                onMouseEnter={() => this.setHovering(true)}
                onMouseLeave={() => this.setHovering(false)}
                >
            {
                (
                    !editing
                    && _.isEmpty(value)
                    && !_.isEmpty(placeholder)
                ) ?
                <span className="markdown-textedit__placeholder">
                    {placeholder}
                </span>
                : null
            }
            <textarea
                className="nice-form-control"
                value={value || ''}
                rows={rows || 1}
                placeholder={placeholder || ''}
                onChange={(e) => this.onChange(e.target.value)}
                onFocus={() => this.setEditing(true)}
                onBlur={() => this.setEditing(false)}
                />
            <MDReactComponent
                className="markdown-textedit__preview"
                text={value || ''} />
        </div>;
    }
}

MarkdownTextField.defaultProps = {
    setState: (value) => {
        console.log(['TextField', value]);
    }
};

MarkdownTextField.propTypes = {
    setState: PropTypes.func.isRequired,
    rows: PropTypes.number,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
};

export default MarkdownTextField;
