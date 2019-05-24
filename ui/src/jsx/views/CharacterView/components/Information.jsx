import React from 'react';
import {
    filter,
    join,
} from 'lodash/fp';
import PropTypes from 'prop-types';

import ListDataWrapper from '../../../hocs/ListDataWrapper.jsx';

import ListLabel from '../../../components/ListLabel.jsx';
import Panel from '../../../components/Panel.jsx';
import UserLabel from '../../../components/UserLabel.jsx';

const Information = function({
    'class': _class, race, background, alignment,
    alignments, xp, adventure_checkpoints, user_id,
}) {
    if (!(race && _class && background)) {
        return null;
    }

    return (
        <Panel
            key="info"
            className="character-view__info info"
            header="Info"
        >
            <thead>
                <tr>
                    <th>Class</th>
                    <th>Background</th>
                    <th>Player</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{_class}</td>
                    <td>{background}</td>
                    <td>
                        <UserLabel user_id={user_id} />
                    </td>
                </tr>
            </tbody>
            <thead>
                <tr>
                    <th>Race</th>
                    <th>Alignment</th>
                    <th>{join(' + ', filter(null, [
                        xp ? 'XP' : null,
                        adventure_checkpoints ? 'ACP' : null,
                    ]))}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{race}</td>
                    <td>
                        <ListLabel
                            items={alignments}
                            value={alignment}
                        />
                    </td>
                    <td>{join(' + ', filter(null, [
                        xp ? `${xp} XP` : null,
                        adventure_checkpoints
                            ? `${adventure_checkpoints} ACP`
                            : null,
                    ]))}</td>
                </tr>
            </tbody>
        </Panel>
    );
};

Information.propTypes = {
    'class': PropTypes.string,
    race: PropTypes.string,
    background: PropTypes.string,
    alignment: PropTypes.string,
    alignments: PropTypes.array,
    xp: PropTypes.number,
    adventure_checkpoints: PropTypes.number,
    user_id: PropTypes.number,
};

Information.defaultProps = {
    'class': '',
    race: '',
    background: '',
    alignment: '',
    alignments: [],
    xp: null,
    adventure_checkpoints: null,
    user_id: null,
};

export default ListDataWrapper(
    Information,
    [
        'alignments',
    ],
    'items'
);
