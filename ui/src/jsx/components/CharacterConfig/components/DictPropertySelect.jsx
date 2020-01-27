import React from 'react';
import PropTypes from 'prop-types';
import { sprintf } from 'sprintf-js';
import MDReactComponent from 'markdown-react-js';

import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper.jsx';

export class DictPropertySelect extends React.Component
{
    constructor(props) {
        super(props);
        this.state = this.constructor.getDerivedStateFromProps(props, {});
    }

    componentDidMount() {
        this.props.onChange(
            this.props.dict
        );
    }

    static getDerivedStateFromProps(props, state) {
        const { current, dict } = props;
        const content = {
            ...current,
            ...dict,
        };
        const value = sprintf(
            content.description || '',
            content
        );

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

DictPropertySelect.propTypes = {
    type: PropTypes.oneOf(['dict']).isRequired,
    uuid: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    current: PropTypes.object,
    hidden: PropTypes.bool,
};

export default CharacterEditorWrapper(
    DictPropertySelect,
    {
        current: true,
    }
);
