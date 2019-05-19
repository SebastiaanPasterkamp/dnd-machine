import React from 'react';
import PropTypes from 'prop-types';

import CharacterLabel from '../../../components/CharacterLabel.jsx';
import CharacterLinks from '../../../components/CharacterLinks.jsx';
import Panel from '../../../components/Panel.jsx';

const Description = function(props) {
    const { id, name } = props;

    return (
        <Panel
            key="description"
            className="character-view__description info"
            header="Description"
        >
            {id !== null && (
                <CharacterLinks
                    className="pull-right"
                    id={id}
                />
            )}

            <h3>{name}</h3>

            <h4>
                <CharacterLabel
                    showName={false}
                    showInfo={true}
                    showProgress={false}
                    character={props}
                />
            </h4>

            <CharacterLabel
                showInfo={false}
                showProgress={true}
                character={props}
            />
        </Panel>
    );
};

Description.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
};

Description.defaultProps = {
    id: null,
    name: 'Unknown',
};

export default Description;
