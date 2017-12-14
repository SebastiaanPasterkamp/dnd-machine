import React from 'react';
import MDReactComponent from 'markdown-react-js';

import ButtonField from './ButtonField.jsx';
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

    render() {
        return <div
                className="markdown-textedit"
                onClick={!this.state.editing
                    ? () => this.setState({editing: !this.state.editing})
                    : null
                }
                >
            {this.state.editing ?
                <textarea
                    className="nice-form-control"
                    value={this.props.value || ''}
                    rows={this.props.rows}
                    placeholder={this.props.placeholder}
                    onChange={(e) => this.onChange(e.target.value)}
                    />
                : <MDReactComponent
                    className="markdown-textedit--preview"
                    text={this.props.value || ''} />
            }
            <ButtonField
                className="markdown-textedit--button"
                name="button"
                color="muted"
                icon={ this.state.editing ? "eye" : "pencil-square-o" }
                onClick={() => this.setState({editing: !this.state.editing})}
                label="&#8203;"
                />
        </div>;
    }
}

MarkdownTextField.defaultProps = {
    setState: (value) => {
        console.log(['TextField', value]);
    }
};

export default MarkdownTextField;
