import React from 'react';
import PropTypes from 'prop-types';
import {
    entries,
    flow,
    keys,
    map,
} from 'lodash/fp';
import MDReactComponent from 'markdown-react-js';
import {sprintf} from 'sprintf-js';

import Panel from '../../../components/Panel.jsx';

const Traits = function({ info }) {
    if (!keys(info).length) {
        return null;
    }

    return (
        <Panel
            key="traits"
            className="character-view__traits info"
            header="Traits"
        >
            <ul>
            {flow(entries, map(([label, description]) => (
                <li key={label}>
                    <strong>{label}</strong>
                    <MDReactComponent text={description} />
                </li>
            )))(info)}
            </ul>
        </Panel>
    );
};

Traits.propTypes = {
    info: PropTypes.objectOf(
        PropTypes.string.isRequired,
    ),
};

Traits.defaultProps = {
    info: {},
};

export default Traits;
