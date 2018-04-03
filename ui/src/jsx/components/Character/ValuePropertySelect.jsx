import React from 'react';
import PropTypes from 'prop-types';

import LazyComponent from '../LazyComponent.jsx';
import MarkdownTextField from '../MarkdownTextField.jsx';

class ValuePropertySelect extends LazyComponent
{
    componentDidMount() {
        this.props.onChange(
            this.props.path,
            this.props.value
        );
    }

    componentWillUnmount() {
        this.props.onChange(
            this.props.path,
            undefined
        );
    }

    render() {
        const { hidden = false, value = '' } = this.props;

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
    path: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
    hidden: PropTypes.bool,
};

export default ValuePropertySelect;
