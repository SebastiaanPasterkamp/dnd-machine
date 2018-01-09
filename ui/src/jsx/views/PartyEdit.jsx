import React from 'react';
import _ from 'lodash';

import '../../sass/_edit-party.scss';

import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';
import ObjectDataActions from '../actions/ObjectDataActions.jsx';

import ButtonField from '../components/ButtonField.jsx';
import CharacterLabel from '../components/CharacterLabel.jsx';
import CharacterLinks from '../components/CharacterLinks.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import UserLabel from '../components/UserLabel.jsx';

import ModalDialog from '../components/ModalDialog.jsx';

export class PartyEdit extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            dialog: false
        };
    }

    onFieldChange(field, value) {
        this.props.setState({
            [field]: value
        });
    }

    onRemoveMemberButton(id) {
        let members = _.without(this.props.members, id);

        this.props.setState({
            members: members
        }, () => {
            this.props.recompute();
        });

    }

    toggleDialog() {
        this.setState({
            dialog: !this.state.dialog
        });
    }

    onAddMemberButton(id) {
        let members = _.union(this.props.members, [id]);

        this.props.setState({
            members: members
        }, () => {
            this.props.recompute();
        });

    }

    renderDialog() {
        if (!this.state.dialog) {
            return null;
        }

        return <ModalDialog
                key="dialog"
                label="Add members"
                onCancel={() => this.toggleDialog()}
                onDone={() => this.toggleDialog()}
                >
            <table className="nice-table condensed bordered">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Character</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>{_.map(this.props.characters, (character) => {
                    if (_.indexOf(this.props.members, character.id) >= 0) {
                        return null;
                    }
                    return <tr key={character.id}>
                        <td>
                            <UserLabel
                                user_id={character.user_id}
                                />
                        </td>
                        <td>
                            <CharacterLabel
                                character_id={character.id}
                                progress={true}
                                />
                        </td>
                        <td>
                            <a
                                className="nice-btn-alt cursor-pointer icon fa-plus"
                                onClick={() => this.onAddMemberButton(character.id)}
                                >
                                Add
                            </a>
                        </td>
                    </tr>;
                })}</tbody>
            </table>
        </ModalDialog>;
    }

    render() {
        return [
            <Panel
                    key="description"
                    className="party-edit__description"
                    header="Description"
                    >
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={this.props.name}
                        setState={
                            (value) => this.onFieldChange('name', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={this.props.description}
                        rows={5}
                        setState={
                            (value) => this.onFieldChange('description', value)
                        } />
                </ControlGroup>
            </Panel>,

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
                        <td>{this.props.members.length}</td>
                        <td className="info">
                            {this.props.challenge.easy}XP
                        </td>
                        <td className="good">
                            {this.props.challenge.medium}XP
                        </td>
                        <td className="warning">
                            {this.props.challenge.hard}XP
                        </td>
                        <td className="bad">
                            {this.props.challenge.deadly}XP
                        </td>
                    </tr>
                </tbody>
            </Panel>,

            <Panel
                    key="members"
                    className="party-edit__members"
                    header="Party Members"
                    >
                <thead>
                    <tr>
                        <th>Character Level</th>
                        <th>Level</th>
                        <th>Easy</th>
                        <th>Medium</th>
                        <th>Hard</th>
                        <th>Deadly</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>{_.map(this.props.members, (id) => {
                    const character = _.get(
                        this.props.characters, id
                    );

                    if (!character) {
                        return null;
                    }

                    return <tr key={id}>
                        <td>{character.name}</td>
                        <td>{character.level}</td>
                        <td className="info">
                            {character.challenge.easy}XP
                        </td>
                        <td className="good">
                            {character.challenge.medium}XP
                        </td>
                        <td className="warning">
                            {character.challenge.hard}XP
                        </td>
                        <td className="bad">
                            {character.challenge.deadly}XP
                        </td>
                        <td>
                            <CharacterLinks
                                altStyle={true}
                                buttons={['view']}
                                character_id={character.id}
                                extra={{
                                    remove: {
                                        label: 'Remove',
                                        action: () => {
                                            this.onRemoveMemberButton(character.id);
                                        },
                                        icon: 'times',
                                        className: 'warning'
                                    }
                                }}
                                />
                        </td>
                    </tr>;
                })}</tbody>
                <tbody>
                    <tr>
                        <td colSpan="6"></td>
                        <td>
                            <a
                                className="nice-btn-alt cursor-pointer icon fa-plus"
                                onClick={() => this.toggleDialog()}
                                >
                                Add
                            </a>
                        </td>
                    </tr>
                </tbody>
            </Panel>,

            this.renderDialog()
        ];
    }
}

export default ObjectDataListWrapper(
    RoutedObjectDataWrapper(
        PartyEdit, {
            className: 'party-edit',
            icon: 'fa-users',
            label: 'Party',
            buttons: ['cancel', 'reload', 'recompute', 'save']
        }, "party"
    ),
    {characters: {type: 'character'}}
);
