import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_character-picker.scss';

import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import CharacterLabel from '../components/CharacterLabel.jsx';
import UserLabel from '../components/UserLabel.jsx';

export class CharacterPicker extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        const {
            actions, characters, filter, showUser,
        } = this.props;

        const filtered = filter
            ? _.filter(characters, filter)
            : characters;

        return (
            <table
                className="nice-table condensed bordered character-picker"
            >
                <thead>
                    <tr>
                        {showUser && <th>Player</th>}
                        <th>Character</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>{_.map(filtered, character => (
                    <tr key={character.id}>
                        {showUser && (
                            <td>
                                <UserLabel
                                    user_id={character.user_id}
                                />
                            </td>
                        )}
                        <td>
                            <CharacterLabel
                                character_id={character.id}
                                character={character}
                                showProgress={true}
                            />
                        </td>
                        <td>
                            <BaseLinkGroup
                                extra={actions(character)}
                            />
                        </td>
                    </tr>
                ))}</tbody>
            </table>
        );
    }
}

CharacterPicker.propTypes = {
    actions: PropTypes.func.isRequired,
    characters: PropTypes.object,
    filter: PropTypes.func,
    showUser: PropTypes.bool,
};

CharacterPicker.defaultProps = {
    characters: {},
    filter: null,
    showUser: false,
};

export default ObjectDataListWrapper(
    CharacterPicker,
    {characters: {type: 'character'}}
);
