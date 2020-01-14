import React from 'react';
import PropTypes from 'prop-types';
import MDReactComponent from 'markdown-react-js';

import LazyComponent from '../../LazyComponent.jsx';
import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper.jsx';

export class ValuePropertySelect extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }

    componentDidMount() {
        this.props.onChange(
            this.props.value
        );
    }

    static getDerivedStateFromProps(props, state) {
        const value = props.value.toString();
        if (value !== state.value) {
            return { value };
        }
        return null;
    }

    render() {
        const { hidden } = this.props;
        const { value } = this.state;

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
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
    hidden: PropTypes.bool,
};

export default CharacterEditorWrapper(ValuePropertySelect);
