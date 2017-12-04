import React from 'react';
import _ from 'lodash';

import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';
import ObjectDataActions from '../actions/ObjectDataActions.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import StatsBlock from '../components/StatsBlock.jsx';
import TextField from '../components/TextField.jsx';

export class PartyEdit extends React.Component
{
    constructor(props) {
        super(props);
    }

    onFieldChange(field, value) {
        console.log(field, value);
        this.props.setState({
            [field]: value
        });
    }

    onRemoveMemberButton(id) {
        fetch('/' + ['party', this.party.id, 'del_character', id].join('/'), {
            credentials: 'same-origin',
            'headers': {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            ObjectDataActions.getObject.completed('party', self.party.id, data);
        });
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
                            <td>{self.party.members.length}</td>
                            <td className="info">{self.party.challenge.easy}</td>
                            <td className="good">{self.party.challenge.medium}</td>
                            <td className="warning">{self.party.challenge.hard}</td>
                            <td className="bad">{self.party.challenge.deadly}</td>
                        </tr>
                    </tbody>
                </table>
            </Panel>

            <Panel id="members" header="Party Members">
                <table className="nice-table condensed striped bordered hover" id="character">
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
                    <tbody>{_.map(self.party.members.map, (id) => {
                        const character = _.get(this.characters, {id: id});

                        return <tr key={character.id}>
                            <td>{character.name}</td>
                            <td>{character.level}</td>
                            <td className="info">{character.challenge.easy}</td>
                            <td className="good">{character.challenge.medium}</td>
                            <td className="warning">{character.challenge.hard}</td>
                            <td className="bad">{character.challenge.deadly}</td>
                            <td>
                                <CharacterLinks
                                    buttons={['view']}
                                    character_id={character.id}
                                    extra={[{
                                        label: 'Remove',
                                        action: () => {
                                            self.onRemoveMemberButton(character.id);
                                        },
                                        icon: 'times',
                                    }]}
                                    />
                            </td>
                        </tr>;
                    })}</body>
                </table>
            </Panel>
        </div>
    </div>;
    }
}

export default RoutedObjectDataWrapper(
    PartyEdit, "character"
);
