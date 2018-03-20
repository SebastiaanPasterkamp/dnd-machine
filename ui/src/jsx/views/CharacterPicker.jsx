import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_character-picker.scss';

import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import CharacterLabel from '../components/CharacterLabel.jsx';
import InputField from '../components/InputField.jsx';
import UserLabel from '../components/UserLabel.jsx';

export class CharacterPicker extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        const {
            actions, characters = [], filter, showUser
        } = this.props;

        const filtered = _.isFunction(filter)
            ? _.filter(
                characters,
                character => filter(character)
            )
            : characters;

        return <table
            className="nice-table condensed bordered character-picker"
            >
            <thead>
                <tr>
                    {showUser ? <th>Player</th> : null }
                    <th>Character</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>{_.map(filtered, character => (
                <tr key={character.id}>
                    {showUser ? <td>
                        <UserLabel
                            user_id={character.user_id}
                            />
                    </td> : null}
                    <td>
                        <CharacterLabel
                            character_id={character.id}
                            showProgress={true}
                            />
                    </td>
                    <td>
                        {actions(character)}
                    </td>
                </tr>
            ))}</tbody>
        </table>;
    }
}

CharacterPicker.propTypes = {
    actions: PropTypes.func.isRequired,
    characters: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    filter: PropTypes.func,
    showUser: PropTypes.bool,
};

export default ObjectDataListWrapper(
    CharacterPicker,
    {characters: {type: 'character'}}
);
