import React from 'react';
import PropTypes from 'prop-types';
import {
    entries,
    flow,
    map,
} from 'lodash/fp';
import MDReactComponent from 'markdown-react-js';
import {sprintf} from 'sprintf-js';

import Panel from '../../../components/Panel.jsx';

const Abilities = function({ abilities }) {
    return (
        <Panel
            key="abilities"
            className="character-view__abilities info"
            header="Abilities"
        >
            <ul>
            {flow(entries, map(([label, data]) => (
                <li key={label}>
                    <strong>{label}</strong>
                    <MDReactComponent
                        text={sprintf(
                            data.description,
                            data
                        )}
                    />
                </li>
            )))(abilities)}
            </ul>
        </Panel>
    );
};

Abilities.propTypes = {
    abilities: PropTypes.objectOf(
        PropTypes.shape({
            description: PropTypes.string.isRequired,
        })
    ),
};

Abilities.defaultProps = {
    abilities: {},
};

export default Abilities;
