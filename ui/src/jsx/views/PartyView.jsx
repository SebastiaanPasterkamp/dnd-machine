import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_party-view.scss';

import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper';
import ObjectDataActions from '../actions/ObjectDataActions';

import ButtonField from '../components/ButtonField';
import CharacterLabel from '../components/CharacterLabel';
import CharacterLinks from '../components/CharacterLinks';
import ControlGroup from '../components/ControlGroup';
import InputField from '../components/InputField';
import Panel from '../components/Panel';
import SingleSelect from '../components/SingleSelect';
import MarkdownTextField from '../components/MarkdownTextField';
import UserLabel from '../components/UserLabel';
import PartyLinks from '../components/PartyLinks';

export class PartyView extends React.Component
{
    characterLinks = ['view'];

    render() {
        const {
            id, name, user_id, description, size, member_ids,
            challenge: { easy, medium, hard, deadly }, characters,
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
                                className="pull-right"
                                id={id}
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
                        <td>
                            <MDReactComponent
                                text={description || ''}
                            />
                        </td>
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
                            {easy}XP
                        </td>
                        <td className="good">
                            {medium}XP
                        </td>
                        <td className="warning">
                            {hard}XP
                        </td>
                        <td className="bad">
                            {deadly}XP
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
                    const {
                        name, level,
                       challenge: { easy, medium, hard, deadly } = {},
                    } = _.get(characters, id, {});

                    if (!name) {
                        return null;
                    }

                    return <tr key={id}>
                        <th>
                            {name}
                            <CharacterLinks
                                altStyle={true}
                                include={this.characterLinks}
                                id={id}
                            />
                        </th>
                        <td>{level}</td>
                        <td className="info">
                            {easy}XP
                        </td>
                        <td className="good">
                            {medium}XP
                        </td>
                        <td className="warning">
                            {hard}XP
                        </td>
                        <td className="bad">
                            {deadly}XP
                        </td>
                    </tr>;
                })}
                </tbody>
            </Panel>
        </React.Fragment>;
    }
};

PartyView.defaultProps = {
    challenge: {},
    characters: [],
};

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
