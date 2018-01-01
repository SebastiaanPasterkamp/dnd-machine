import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

import _ from 'lodash';

export class FormGroup extends LazyComponent
{
    renderLabel(index, label) {
        return <span
                key={"label-" + index}
                className="nice-input-addon">
            {label}
        </span>;
    }

    render() {
        return <div className="nice-form-group">
            <label>{this.props.label}</label>
            {this.props.children}
        </div>;
    }
}

export default FormGroup;