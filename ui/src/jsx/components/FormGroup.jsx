import React from 'react';
import PropTypes from 'prop-types';

export const FormGroup = function({ label, children })
{
    return (
        <div className="nice-form-group">
            <label>{ label }</label>
            { children }
        </div>
    );
};

FormGroup.propTypes = {
    label: PropTypes.string,
    children: PropTypes.any,
};

export default FormGroup;
