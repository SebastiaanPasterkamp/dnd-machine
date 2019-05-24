import React from 'react';
import PropTypes from 'prop-types';
import {
    entries,
    flow,
    map,
} from 'lodash/fp';

import ListDataWrapper from '../../../hocs/ListDataWrapper.jsx';

import Panel from '../../../components/Panel.jsx';
import { SpellLabel } from '../../../components/SpellLabel.jsx';

const Spells = function({
    spell: {
        list,
        prepared,
        level,
    },
    magic_components,
    magic_schools,
}) {
    if (
        !list.length
        && !prepared.length
    ) {
        return null;
    }

    return (
        <Panel
            key="equipment"
            className="character-view__spells info"
            header="Spells"
        >
        {flow(entries, map(([level, spells]) => {
            if (!spells.length) {
                return null;
            }

            return map((spell) => (
                <SpellLabel
                    key={spell.id}
                    magic_components={magic_components}
                    magic_schools={magic_schools}
                    spell_id={spell.id}
                    spell={spell}
                    tooltip={true}
                />
            ))(spells);
        }))(level)}
        </Panel>
    );
};

Spells.propTypes = {
    spell: PropTypes.shape({
        list: PropTypes.array,
        prepared: PropTypes.array,
        level: PropTypes.object,
    }),
    magic_components: PropTypes.array,
    magic_schools: PropTypes.array,
};

Spells.defaultProps = {
    spell: {
        list: [],
        prepared: [],
        level: {},
    },
    magic_components: [],
    magic_schools: [],
};

export default ListDataWrapper(
    Spells,
    [
        "magic_components",
        "magic_schools",
    ],
    'items'
);
