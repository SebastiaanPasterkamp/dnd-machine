import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_tool-tip.scss';

import LazyComponent from '../components/LazyComponent.jsx';

class ToolTip extends LazyComponent
{
    render() {
        const { content } = this.props;
        if (!content) {
            return this.props.children || null;
        }
        return <div className="tool-tip inline">
            {this.props.children}
            <MDReactComponent
                className="tool-tip--content"
                text={content}
                />
        </div>;
    }
}

ToolTip.propTypes = {
    content: PropTypes.string,
};

export default ToolTip;