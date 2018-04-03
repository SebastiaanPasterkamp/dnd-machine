import React from 'react';
import PropTypes from 'prop-types';
import {sprintf} from 'sprintf-js';

import LazyComponent from '../LazyComponent.jsx';
import MarkdownTextField from '../MarkdownTextField.jsx';

class DictPropertySelect extends LazyComponent
{
    componentDidMount() {
        this.props.onChange(
            this.props.path,
            this.props.dict
        );
    }

    componentWillUnmount() {
        this.props.onChange(
            this.props.path,
            undefined
        );
    }

    render() {
        const { hidden = false, current, dict = {} } = this.props;

        if (hidden) {
            return null;
        }

        const _dict = _.assign(
            {},
            current,
            dict
        );

        return <MarkdownTextField
            className="small"
            disabled={true}
            value={sprintf(_dict.description, _dict)}
            />;
    }
};

DictPropertySelect.propTypes = {
    path: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    current: PropTypes.object,
    hidden: PropTypes.bool,
};

export default DictPropertySelect;
