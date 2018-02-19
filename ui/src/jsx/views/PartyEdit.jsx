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

    toggleDialog() {
        this.setState({
            dialog: !this.state.dialog
        });
    }

    onFieldChange(field, value) {
        this.props.setState({
            [field]: value
        });
    }

    onRemoveMemberButton(id) {
        const {
            member_ids, setState, recompute
        } = this.props;
        let update = _.without(member_ids, id);

        setState(
            {member_ids: update},
            () => recompute()
        );
    }

    onAddMemberButton(id) {
        const {
            member_ids, setState, recompute
        } = this.props;
        let update = _.union(member_ids, [id]);

        setState(
            {member_ids: update},
            () => recompute()
        );
    }

    renderDialog() {
        if (!this.state.dialog) {
            return null;
        }

        const {
            characters, member_ids, reload
        } = this.props;

        const filtered = _.filter(
            characters,
            (character) => !_.includes(member_ids, character.id)
        );

        return <ModalDialog
                key="dialog"
                label="Add members"
                onCancel={() => reload(() => this.toggleDialog())}
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
                <tbody>{_.map(filtered, (character) => {
                    return <tr key={character.id}>
                        <td>
                            <UserLabel
                                user_id={character.user_id}
                                />
                        </td>
                        <td>
                            <CharacterLabel
                                character_id={character.id}
                                showProgress={true}
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
        const {
            name, description, member_ids, challenge, characters
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
                        setState={
                            (value) => this.onFieldChange('name', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={description}
                        rows={5}
                        setState={
                            (value) => this.onFieldChange('description', value)
                        } />
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
                            {challenge.easy}XP
                        </td>
                        <td className="good">
                            {challenge.medium}XP
                        </td>
                        <td className="warning">
                            {challenge.hard}XP
                        </td>
                        <td className="bad">
                            {challenge.deadly}XP
                        </td>
                    </tr>
                </tbody>
            </Panel>

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
                    </tr>
                </thead>
                <tbody>{_.map(member_ids, (id) => {
                    const character = _.get(
                        characters, id
                    );

                    if (!character) {
                        return null;
                    }

                    return <tr key={id}>
                        <th>
                            {character.name}
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
                        </th>
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
                    </tr>;
                })}</tbody>
                <tbody>
                    <tr>
                        <td colSpan={5}>
                            <a
                                className="nice-btn-alt cursor-pointer icon fa-plus"
                                onClick={() => this.toggleDialog()}
                                >
                                Add
                            </a>
                        </td>
                    </tr>
                </tbody>
            </Panel>

            {this.renderDialog()}
        </React.Fragment>;
    }
}

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
