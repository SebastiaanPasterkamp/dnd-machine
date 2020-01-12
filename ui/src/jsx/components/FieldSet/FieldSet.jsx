import React from 'react';
import PropTypes from 'prop-types';

export const FieldSet = function({ label, children })
{
    return (
        <fieldset className="nice-form-group">
            <legend>{ label }</legend>
            { children }
        </fieldset>
    );
};

FieldSet.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.any,
};

FieldSet.defaultProps = {
    label: '',
}

export default FieldSet;
