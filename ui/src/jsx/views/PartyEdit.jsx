import React from 'react';
import _ from 'lodash';

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
import TextField from '../components/TextField.jsx';
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
            label="Add members"
            onCancel={() => this.toggleDialog()}
            onDone={() => this.toggleDialog()}
            >
            <table className="nice-table condensed bordered">
                <thead>
                    <tr>
                        <td>Player</td>
                        <td>Character</td>
                        <td>Action</td>
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
        return <div>
        <h2 className="icon fa-users">Party</h2>

        <div id="edit-party">
            <Panel id="description" header="Description">
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={this.props.name}
                        setState={
                            (value) => this.onFieldChange('name', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Description">
                    <TextField
                        placeholder="Description..."
                        value={this.props.description}
                        rows={5}
                        setState={
                            (value) => this.onFieldChange('description', value)
                        } />
                </ControlGroup>
            </Panel>

            <Panel id="challenge" header="Challenge Rating">
                <table className="nice-table condensed bordered" id="party">
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
                </table>
            </Panel>

            <Panel id="members" header="Party Members">
                <table className="nice-table condensed bordered" id="character">
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
                </table>
            </Panel>

            <Panel id="save" header="Save">
                {this.props.cancel
                    ? <ButtonField
                        name="button"
                        value="cancel"
                        color="muted"
                        icon="ban"
                        onClick={() => this.props.cancel()}
                        label="Cancel" />
                    : null
                }
                {this.props.reload
                    ? <ButtonField
                        name="button"
                        value="reload"
                        color="info"
                        icon="refresh"
                        onClick={() => this.props.reload()}
                        label="Reload" />
                    : null
                }
                {this.props.save
                    ? <ButtonField
                        name="button"
                        value="cancel"
                        color="primary"
                        icon="save"
                        onClick={() => this.props.save()}
                        label="Save" />
                    : null
                }
            </Panel>
        </div>

        {this.renderDialog()}

    </div>;
    }
}

export default ObjectDataListWrapper(
    RoutedObjectDataWrapper(
        PartyEdit, "party"
    ),
    {characters: {type: 'character'}}
);
