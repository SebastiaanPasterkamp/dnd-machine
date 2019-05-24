import React from 'react';
import PropTypes from 'prop-types';
import MDReactComponent from 'markdown-react-js';
import {sprintf} from 'sprintf-js';

import Panel from '../../../components/Panel.jsx';

const Personality = function({
    traits, ideals, bonds, flaws,
}) {
    if (!( traits || ideals || bonds || flaws )) {
        return null;
    }

    return (
        <Panel
            key="personality"
            className="character-view__personality info"
            header="Personality"
        >
            <strong>Traits</strong>
            <MDReactComponent text={traits} />

            <strong>Ideals</strong>
            <MDReactComponent text={ideals} />

            <strong>Bonds</strong>
            <MDReactComponent text={bonds} />

            <strong>Flaws</strong>
            <MDReactComponent text={flaws} />
        </Panel>
    );
};

Personality.propTypes = {
    traits: PropTypes.string,
    ideals: PropTypes.string,
    bonds: PropTypes.string,
    flaws: PropTypes.string,
};

Personality.defaultProps = {
    traits: '',
    ideals: '',
    bonds: '',
    flaws: '',
};

export default Personality;
