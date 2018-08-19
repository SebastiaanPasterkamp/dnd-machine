import React from 'react';
import PropTypes from 'prop-types';

import LazyComponent from '../LazyComponent.jsx';
import MarkdownTextField from '../MarkdownTextField.jsx';
import CharacterEditorWrapper from '../../hocs/CharacterEditorWrapper.jsx';

export class ValuePropertySelect extends LazyComponent
{
    componentDidMount() {
        this.props.onChange(
            this.props.value
        );
    }

    render() {
        const {
            hidden,
            value,
        } = this.props;

        if (hidden) {
            return null;
        }

        return <MarkdownTextField
            className="small"
            disabled={true}
            value={value.toString()}
            />;
    }
};

ValuePropertySelect.propTypes = {
    type: PropTypes.oneOf(['value']).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
    hidden: PropTypes.bool,
};

export default CharacterEditorWrapper(ValuePropertySelect);
