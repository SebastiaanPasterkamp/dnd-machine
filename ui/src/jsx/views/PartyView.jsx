import React from 'react';
import _ from 'lodash';

import '../../sass/_party-view.scss';

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
import PartyLinks from '../components/PartyLinks.jsx';

export class PartyView extends React.Component
{
    render() {
        const {
            id, name, user_id, description, size, member_ids,
            challenge, characters
        } = this.props;

        return <React.Fragment>
            <Panel
                key="description"
                className="party-view__description info"
                header="Description"
                >
                <thead>
                    <tr>
                        <th colSpan="2">
                            <PartyLinks
                                buttons={['edit']}
                                className="pull-right"
                                party_id={id}
                                />

                            <h3>{name}</h3>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <th>Dungeon Master</th>
                        <td>
                            <UserLabel
                                user_id={user_id}
                                />
                        </td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>{description}</td>
                    </tr>
                </tbody>
            </Panel>

            <Panel
                    key="challenge"
                    className="party-view__challenge info"
                    header="Party Encounter Challenge Rating"
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
                        <td>{size}</td>
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
                    className="party-view__members info"
                    header="Individual Challenge Rating"
                    >
                <thead>
                    <tr>
                        <th>Character</th>
                        <th>Level</th>
                        <th>Easy</th>
                        <th>Medium</th>
                        <th>Hard</th>
                        <th>Deadly</th>
                    </tr>
                </thead>
                <tbody>
                {_.map(member_ids, (id) => {
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
                })}
                </tbody>
            </Panel>
        </React.Fragment>;
    }
}

export default ObjectDataListWrapper(
    RoutedObjectDataWrapper(
        PartyView,
        {
            className: 'party-view',
            icon: 'fa-users',
            label: 'Party',
        },
        "party"
    ),
    {characters: {type: 'character'}}
);
