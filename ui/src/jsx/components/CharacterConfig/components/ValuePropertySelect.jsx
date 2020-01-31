import React from 'react';
import PropTypes from 'prop-types';
import MDReactComponent from 'markdown-react-js';

import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper';

export class ValuePropertySelect extends React.Component
{
    componentDidMount() {
        const { value, onChange } = this.props;
        onChange( value );
    }

    render() {
        const { value, hidden } = this.props;

        if (hidden) {
            return null;
        }

        return (
            <MDReactComponent text={value || ''} />
        );
    }
};

ValuePropertySelect.propTypes = {
    type: PropTypes.oneOf(['value']).isRequired,
    uuid: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
    hidden: PropTypes.bool,
};

export default CharacterEditorWrapper(ValuePropertySelect);
