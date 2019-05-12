import React from 'react';
import PropTypes from 'prop-types';
import { sprintf } from 'sprintf-js';

import utils from '../../utils.jsx';

import MarkdownTextField from '../MarkdownTextField.jsx';
import CharacterEditorWrapper from '../../hocs/CharacterEditorWrapper.jsx';

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
            <MarkdownTextField
                className="small"
                disabled={true}
                value={value}
            />
        );
    }
};

DictPropertySelect.propTypes = {
    type: PropTypes.oneOf(['dict']).isRequired,
    dict: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    current: PropTypes.object,
    hidden: PropTypes.bool,
};

export default CharacterEditorWrapper(
    DictPropertySelect,
    {
        current: true,
    }
);