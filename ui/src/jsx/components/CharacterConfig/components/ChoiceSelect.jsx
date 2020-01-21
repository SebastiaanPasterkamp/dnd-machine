import React from 'react';
import PropTypes from 'prop-types';
import {
    entries,
    filter,
    flow,
    map,
} from 'lodash/fp';

import LazyComponent from '../../LazyComponent.jsx';
import TabComponent from '../../TabComponent.jsx';

import CharacterConfig from '../CharacterConfig.jsx';
import MatchesFilters from '../utils/MatchesFilters';

export const ChoiceSelect = function({ options, filter: filters }) {
    const filtered = filter(
        (option) => !option.hidden && MatchesFilters(option, filters)
    )(options);

    return (
        <TabComponent tabConfig={filtered}>
            {flow(entries, map(
                ([index, option]) => (
                    <CharacterConfig
                        key={ index }
                        config={ [option] }
                    />
                )
            ))(filtered)}
        </TabComponent>
    );
};

ChoiceSelect.propTypes = {
    type: PropTypes.oneOf(['choice']).isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            description: PropTypes.string,
        })
    ).isRequired,
    description: PropTypes.string,
};

export default ChoiceSelect;
