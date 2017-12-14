import React from 'react';
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
        const editing = this.state.editing;

        return <div
                className="markdown-textedit"
                onClick={!editing
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
                <span className="markdown-textedit--placeholder">
                    {this.props.placeholder}
                </span>
                : null
            }
            {editing ?
                <textarea
                    className="nice-form-control"
                    autoFocus={true}
                    value={this.props.value || ''}
                    rows={this.props.rows}
                    placeholder={this.props.placeholder || ''}
                    onChange={(e) => this.onChange(e.target.value)}
                    onBlur={() => this.setEditing(false)}
                    />
                : <MDReactComponent
                    className="markdown-textedit--preview"
                    text={this.props.value || ''} />
            }
        </div>;
    }
}

MarkdownTextField.defaultProps = {
    setState: (value) => {
        console.log(['TextField', value]);
    }
};

export default MarkdownTextField;
