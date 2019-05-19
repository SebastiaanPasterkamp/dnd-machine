import React from 'react';
import PropTypes from 'prop-types';
import {
    includes,
    map,
} from 'lodash/fp';

import ListDataWrapper from '../../../hocs/ListDataWrapper.jsx';

import Bonus from '../../../components/Bonus.jsx';
import CheckBox from '../../../components/CheckBox.jsx';
import Panel from '../../../components/Panel.jsx';

const Statistics = function({
    stats: {
        base,
        modifiers,
    },
    statistics,
    proficiencies: {
        saving_throws: prof_sav,
    },
    saving_throws,
}) {
    return (
        <Panel
            className="character-view__statistics info"
            header="Statistics"
        >
            <thead>
                <tr>
                    <th />
                    <th>Statistic</th>
                    <th>Modifier</th>
                    <th>Saving Throw</th>
                </tr>
            </thead>
            <tbody>
            {map(({code, label}) => (
                <tr key={code}>
                    <th>{label}</th>
                    <td>{base[code]}</td>
                    <td>
                        <Bonus bonus={modifiers[code]} />
                    </td>
                    <td>
                        <CheckBox isChecked={includes(code, prof_sav)} />
                        <Bonus bonus={saving_throws[code]} />
                    </td>
                </tr>
            ))(statistics)}
            </tbody>
        </Panel>
    );
};

Statistics.propTypes = {
    statistics: PropTypes.arrayOf(
        PropTypes.shape({
            code: PropTypes.string,
            label: PropTypes.string,
        })
    ),
    stats: PropTypes.shape({
        base: PropTypes.object,
        modifiers: PropTypes.object,
    }),
    proficiencies: PropTypes.shape({
        saving_throws: PropTypes.array,
    }),
    saving_throws: PropTypes.object,
};

Statistics.defaultProps = {
    statistics: [],
    stats: {
        base: {},
        modifiers: {},
    },
    proficiencies: {
        saving_throws: [],
    },
    saving_throws: {},
};

export { Statistics };

export default ListDataWrapper(
    Statistics,
    [
        'statistics',
    ],
    'items'
);
