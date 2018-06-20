import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

export class FormGroup extends LazyComponent
{
    render() {
        const {
            label, children,
        } = this.props;
        return <div className="nice-form-group">
            <label>{ label }</label>
            { children }
        </div>;
    }
}

export default FormGroup;