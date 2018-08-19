import React from 'react';
import PropTypes from 'prop-types';
import { sprintf } from 'sprintf-js';
import _ from 'lodash';

import utils from '../../utils.jsx';

import LazyComponent from '../LazyComponent.jsx';
import MarkdownTextField from '../MarkdownTextField.jsx';
import CharacterEditorWrapper from '../../hocs/CharacterEditorWrapper.jsx';

export class DictPropertySelect extends LazyComponent
{
    componentDidMount() {
        this.props.onChange(
            this.props.dict
        );
    }

    render() {
        const {
            hidden,
            current,
            dict,
        } = this.props;

        if (hidden) {
            return null;
        }

        const content = current || dict;

        return <MarkdownTextField
            className="small"
            disabled={true}
            value={sprintf(content.description || '', content)}
            />;
    }
};

DictPropertySelect.propTypes = {
    type: PropTypes.oneOf(['dict']).isRequired,
    dict: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    current: PropTypes.object,
    hidden: PropTypes.bool,
};

export default CharacterEditorWrapper(DictPropertySelect);
