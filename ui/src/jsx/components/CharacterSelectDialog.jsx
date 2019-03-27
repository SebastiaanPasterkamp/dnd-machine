import React from 'react';
import PropTypes from 'prop-types';

import { memoize } from '../utils';

import CharacterPicker from '../views/CharacterPicker.jsx';
import ModalDialog from './ModalDialog.jsx';

export class CharacterSelectDialog extends React.PureComponent
{
    constructor(props) {
        super(props);
        this.state = {
            character_id: null,
        };
        this.memoize = memoize.bind(this);
    }

    characterActions = ({ id: character_id }) => ({
        pick: {
            className: this.state.character_id === character_id
                ? 'accent'
                : null,
            label: 'Pick',
            action: this.onPick(character_id),
            icon: 'user-secret',
        },
    });

    onPick = (character_id) => this.memoize(
        `pick-${character_id}`,
        () => this.setState({ character_id })
    );

    onDone = () => this.props.onDone(
        this.state.character_id
    );

    render() {
        const { onCancel, filter } = this.props
        const { character_id } = this.state;

        return (
            <ModalDialog
                label="Pick a Character"
                onCancel={onCancel}
                onDone={character_id === null ? null : this.onDone}
            >
                <CharacterPicker
                    filter={filter}
                    actions={this.characterActions}
                    picked={character_id}
                />
            </ModalDialog>
        );
    }
};

CharacterSelectDialog.propTypes = {
    onCancel: PropTypes.func,
    onDone: PropTypes.func.isRequired,
    filter: PropTypes.func,
};

CharacterSelectDialog.defaultProps = {
    onCancel: null,
    filter: () => true,
};

export default CharacterSelectDialog;
