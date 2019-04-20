import React from 'react';
import PropTypes from 'prop-types';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../../BaseLinkGroup/index.jsx';
import CharacterLabel from '../../CharacterLabel.jsx';
import UserLabel from '../../UserLabel.jsx';


class CharacterRow extends React.PureComponent
{
    onPick = () => {
        const { item: { id }, onPick } = this.props;
        onPick(id);
    }

    render() {
        const {
            item: character,
            label,
            icon,
            currentPick,
        } = this.props;

        return (
            <div className="character-picker__row">
                <UserLabel
                    user_id={character.user_id}
                />
                <CharacterLabel
                    character_id={character.id}
                    character={character}
                    showProgress={true}
                />
                <div className="actions">
                    <BaseLinkGroup>
                        <BaseLinkButton
                            label={label}
                            icon={icon}
                            className={character.id === currentPick
                                ? "accent"
                                : null
                            }
                            action={this.onPick}
                        />
                    </BaseLinkGroup>
                </div>
            </div>
        );
    }
}

CharacterRow.propTypes = {
    onPick: PropTypes.func.isRequired,
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        user_id: PropTypes.number.isRequired,
    }).isRequired,
    currentPick: PropTypes.number,
    label: PropTypes.string,
    icon: PropTypes.string,
};

CharacterRow.defaultProps = {
    currentPick: null,
    label: "Pick",
    icon: "user-secret",
};

export default CharacterRow;
