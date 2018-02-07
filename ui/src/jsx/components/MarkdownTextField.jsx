import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import LazyComponent from './LazyComponent.jsx';

import '../../sass/_markdown-textedit.scss';

export class MarkdownTextField extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            editing: false
        };
    }

    onChange(value) {
        this.props.setState(value);
    }

    setEditing(editing) {
        this.setState({editing});
    }

    render() {
        const editing = this.state.editing,
            style = [
                "markdown-textedit",
                editing ? "edit" : "preview",
                this.props.className,
            ];

        return <div
                className={style.join(' ')}
                onClick={!editing && !this.props.disabled
                    ? () => this.setEditing(true)
                    : null
                }
                >
            {
                (
                    !editing
                    && _.isEmpty(this.props.value)
                    && !_.isEmpty(this.props.placeholder)
                ) ?
                <span className="markdown-textedit__placeholder">
                    {this.props.placeholder}
                </span>
                : null
            }
            <textarea
                className="nice-form-control"
                autoFocus={true}
                value={this.props.value || ''}
                rows={this.props.rows}
                placeholder={this.props.placeholder || ''}
                onChange={(e) => this.onChange(e.target.value)}
                onBlur={() => this.setEditing(false)}
                />
            <MDReactComponent
                className="markdown-textedit__preview"
                text={this.props.value || ''} />
        </div>;
    }
}

MarkdownTextField.defaultProps = {
    disabled: false,
    rows: 1,
    setState: (value) => {
        console.log(['TextField', value]);
    }
};

export default MarkdownTextField;
