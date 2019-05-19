import React from 'react';
import PropTypes from 'prop-types';
import MDReactComponent from 'markdown-react-js';

import Panel from '../../../components/Panel.jsx';

const Backstory = function({ backstory }) {
    if (!backstory) {
        return null;
    }

    return (
        <Panel
            key="backstory"
            className="character-view__backstory info"
            header="Backstory"
        >
            <MDReactComponent text={backstory} />
        </Panel>
    );
};

Backstory.propTypes = {
    description: PropTypes.string,
};

Backstory.defaultProps = {
    description: null,
};

export default Backstory;
