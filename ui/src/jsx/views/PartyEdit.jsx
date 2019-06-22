import React from 'react';
import PropTypes from 'prop-types';
import {
    concat,
    filter,
    get,
    includes,
    map,
    without,
} from 'lodash/fp';

import '../../sass/_edit-party.scss';

import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';
import ObjectDataActions from '../actions/ObjectDataActions.jsx';

import { BaseLinkButton } from '../components/BaseLinkGroup/index.jsx';
import ButtonField from '../components/ButtonField.jsx';
import { CharacterPicker } from '../components/CharacterPicker';
import CharacterLabel from '../components/CharacterLabel.jsx';
import CharacterLinks from '../components/CharacterLinks.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import UserLabel from '../components/UserLabel.jsx';

export class PartyEdit extends React.PureComponent
{
    characterLinks = ['view', 'remove'];

    constructor(props) {
        super(props);
        this.state = {
            dialog: false,
        };
        this.memoize = {};
    }

    callback = (name, callback) => {
        if (!(name in this.memoize)) {
            this.memoize[name] = callback;
        }
        return this.memoize[name];
    }

    onCancel = () => {
        const { reload } = this.props;
        if (reload) {
            reload();
        }
        this.toggleDialog();
    }

    toggleDialog = () => {
        const { dialog } = this.state;
        this.setState({ dialog: !dialog });
    }

    onFieldChange(field, value) {
        this.props.setState({
            [field]: value
        });
    }

    onRemoveMember = (id) => {
        const {
            member_ids: old_party,
            setState,
            recompute,
        } = this.props;
        const member_ids = without([ id ], old_party);

        setState({ member_ids }, () => recompute());
    }

    onAddMember = (id) => {
        const {
            member_ids: old_party,
            setState,
            recompute,
        } = this.props;
        const member_ids = concat([ id ], old_party);

        setState({ member_ids }, () => recompute());
    }

    onCharacterFilter = (character) => {
        const { member_ids } = this.props;

        return !includes(character.id, member_ids);
    }

    render() {
        const { dialog } = this.state;
        const {
            name, description, member_ids,
            challenge: { easy, medium, hard, deadly },
            characters, setState,
        } = this.props;

        return <React.Fragment>
            <Panel
                key="description"
                className="party-edit__description"
                header="Description"
            >
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={name}
                        setState={this.callback(
                            'name',
                            (name) => setState({name})
                        )}
                    />
                </ControlGroup>
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={description}
                        rows={5}
                        setState={this.callback(
                            'description',
                            (description) => setState({description})
                        )}
                    />
                </ControlGroup>
            </Panel>

            <Panel
                key="challenge"
                className="party-edit__challenge"
                header="Challenge Rating"
            >
                <thead>
                    <tr>
                        <th>Party size</th>
                        <th className="info">Easy</th>
                        <th className="good">Medium</th>
                        <th className="warning">Hard</th>
                        <th className="bad">Deadly</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{member_ids.length}</td>
                        <td className="info">
                            {easy} XP
                        </td>
                        <td className="good">
                            {medium} XP
                        </td>
                        <td className="warning">
                            {hard} XP
                        </td>
                        <td className="bad">
                            {deadly} XP
                        </td>
                    </tr>
                </tbody>
            </Panel>

            <Panel
                key="members"
                className="party-edit__members"
                header="Party Members"
            >
                {map((id) => {
                    const character = get(id, characters);

                    if (!character) {
                        return null;
                    }

                    return (
                        <div key={`character-${id}`}>
                            <CharacterLabel
                                character={character}
                                showProgress={true}
                            />
                            <CharacterLinks
                                altStyle={true}
                                include={this.characterLinks}
                                id={character.id}
                            >
                                <BaseLinkButton
                                    name="remove"
                                    label="Remove"
                                    icon="times"
                                    className="warning"
                                    altStyle={true}
                                    action={this.callback(
                                        `delete-${id}`,
                                        () => this.onRemoveMember(
                                            id
                                        )
                                    )}
                                />
                            </CharacterLinks>
                        </div>
                    );
                })(member_ids)}

                <BaseLinkButton
                    name="add"
                    label="Add"
                    icon="plus"
                    className="default"
                    altStyle={true}
                    action={this.toggleDialog}
                />
            </Panel>

            {dialog && (
                <CharacterPicker
                    characters={characters}
                    onDone={this.toggleDialog}
                    onFilter={this.onCharacterFilter}
                    onPick={this.onAddMember}
                    label="Add character"
                    icon="plus"
                />
            )}
        </React.Fragment>;
    }
}

PartyEdit.propTypes = {
    reload: PropTypes.func,
    setState: PropTypes.func.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    challenge: PropTypes.shape({
        easy: PropTypes.number.isRequired,
        medium: PropTypes.number.isRequired,
        hard: PropTypes.number.isRequired,
        deadly: PropTypes.number.isRequired,
    }),
    characters: PropTypes.objectOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
        })
    ),
    member_ids: PropTypes.arrayOf(
        PropTypes.number,
    ),

};


PartyEdit.defaultProps = {
    name: '',
    description: '',
    challenge: {
        easy: 0,
        medium: 0,
        hard: 0,
        deadly: 0,
    },
    member_ids: [],
    characters: {},
};

export default ObjectDataListWrapper(
    RoutedObjectDataWrapper(
        PartyEdit,
        {
            className: 'party-edit',
            icon: 'fa-users',
            label: 'Party',
            buttons: ['cancel', 'reload', 'recompute', 'save']
        },
        "party"
    ),
    {characters: {type: 'character'}}
);
