import React from 'react';
import PropTypes from 'prop-types';
import {
    includes,
    keys,
    map,
} from 'lodash/fp';

import ListDataWrapper from '../../../hocs/ListDataWrapper.jsx';

import Bonus from '../../../components/Bonus.jsx';
import CheckBox from '../../../components/CheckBox.jsx';
import Panel from '../../../components/Panel.jsx';

const Skills = function({
    statistics,
    skills,
    skillBonus,
    proficiencies: {
        skills: prof_skl,
        expertise: prof_exp,
    },
}) {
    if (!keys(skillBonus).length) {
        return null;
    }

    return (
        <Panel
            className="character-view__skills info"
            header="Skills" contentComponent="table"
        >
        {map((stat) => (
            <React.Fragment key={stat.id}>
                <thead>
                    <tr>
                        <th
                            colSpan="2"
                            className="text-align-center"
                        >
                            {stat.name}
                        </th>
                    </tr>
                </thead>

                <tbody>
                {map((skill) => {
                    if (skill.stat !== stat.id) {
                        return null;
                    }

                    return (
                        <tr key={skill.id}>
                            <th>{skill.name}</th>
                            <td>
                                <CheckBox
                                    isChecked={includes(
                                        skill.id,
                                        prof_skl
                                    )}
                                />
                                {prof_exp.length ? (
                                    <CheckBox
                                        isChecked={includes(
                                            skill.id,
                                            prof_exp
                                        )}
                                    />
                                ) : null}
                                <Bonus bonus={skillBonus[skill.id]} />
                            </td>
                        </tr>
                    );
                })(skills)}
                </tbody>
            </React.Fragment>
        ))(statistics)}
        </Panel>
    );
};

Skills.propTypes = {
    statistics: PropTypes.array,
    skills: PropTypes.array,
    skillBonus: PropTypes.objectOf(
        PropTypes.number,
    ),
    proficiencies: PropTypes.shape({
        skills: PropTypes.array,
        expertise: PropTypes.array,
    }),
};

Skills.defaultProps = {
    statistics: [],
    skills: [],
    skillBonus: {},
    proficiencies: {
        skills: [],
        expertise: [],
    },
};

export { Skills };

export default ListDataWrapper(
    Skills,
    [
        'skills',
        'statistics',
    ],
    'items'
);
