import React from 'react';
import _ from 'lodash';

import '../../sass/_edit-party.scss';

import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';
import ObjectDataActions from '../actions/ObjectDataActions.jsx';

import { BaseLinkButton } from '../components/BaseLinkGroup/index.jsx';
import ButtonField from '../components/ButtonField.jsx';
import {CharacterPicker} from './CharacterPicker.jsx';
import CharacterLabel from '../components/CharacterLabel.jsx';
import CharacterLinks from '../components/CharacterLinks.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import UserLabel from '../components/UserLabel.jsx';

import ModalDialog from '../components/ModalDialog.jsx';

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
        reload();
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
        const member_ids = _.without(old_party, id);

        setState({ member_ids }, () => recompute());
    }

    onAddMember = (id) => {
        const {
            member_ids: old_party,
            setState,
            recompute,
        } = this.props;
        const member_ids = _.union(old_party, [id]);

        setState({ member_ids }, () => recompute());
    }

    actions = (character) => {
        return ({
            add: {
                label: 'Add',
                action: this.callback(
                    `add-${character.id}`,
                    () => this.onAddMember(character.id)
                ),
                icon: 'plus',
            },
        });
    }

    renderDialog() {
        if (!this.state.dialog) {
            return null;
        }

        const {
            characters,
            member_ids = [],
        } = this.props;

        return <ModalDialog
            key="dialog"
            label="Add members"
            onCancel={this.onCancel}
            onDone={this.toggleDialog}
            >
            <CharacterPicker
                characters={characters}
                showUser={true}
                filter={character => !_.includes(
                    member_ids,
                    character.id
                )}
                actions={this.actions}
            />
        </ModalDialog>;
    }

    render() {
        const {
            name, description, member_ids = [],
            challenge: { easy, medium, hard, deadly } = {},
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
                    const character = _.get(characters, id);

                    if (!character) {
                        return null;
                    }

                    return <tr key={id}>
                        <th>
                            {character.name}
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
                        </th>
                        <td>{character.level}</td>
                        <td className="info">
                            {character.challenge.easy} XP
                        </td>
                        <td className="good">
                            {character.challenge.medium} XP
                        </td>
                        <td className="warning">
                            {character.challenge.hard} XP
                        </td>
                        <td className="bad">
                            {character.challenge.deadly} XP
                        </td>
                    </tr>;
                })}</tbody>
                <tbody>
                    <tr>
                        <th>
                            <a
                                className="nice-btn-alt cursor-pointer icon fa-plus"
                                onClick={this.toggleDialog}
                            >
                                Add
                            </a>
                        </th>
                        <td colSpan={4}>
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
