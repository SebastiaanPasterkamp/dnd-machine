import React from 'react';
import PropTypes from 'prop-types';
import MDReactComponent from 'markdown-react-js';

import './sass/_tool-tip.scss';

export const ToolTip = function({ content, children }) {
    if (!content) {
        return children;
    }

    return(
        <div className="tool-tip inline">
            {children}
            <MDReactComponent className="tool-tip--content" text={content} />
        </div>
    );
}

ToolTip.propTypes = {
    content: PropTypes.string,
};

ToolTip.defaultProps = {
    content: null,
};

export default ToolTip;
