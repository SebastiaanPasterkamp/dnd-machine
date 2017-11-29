import React from 'react';
import _ from 'lodash';

import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import StatsBlock from '../components/StatsBlock.jsx';
import TextField from '../components/TextField.jsx';

export class CharacterEdit extends React.Component
{
    constructor(props) {
        super(props);
        this.genders = [
            {code: "male", label: "Male"},
            {code: "female", label: "Female"},
            {code: "genderless", label: "genderless"},
        ];
        this.alignments = [
            {code: "lawful good", label: "Lawful good"},
            {code: "neutral good", label: "Neutral good"},
            {code: "chaotic good", label: "Chaotic good"},

            {code: "lawful neutral", label: "Lawful neutral"},
            {code: "true neutral", label: "True neutral"},
            {code: "chaotic neutral", label: "Chaotic neutral"},

            {code: "lawful evil", label: "Lawful evil"},
            {code: "neutral evil", label: "Neutral evil"},
            {code: "chaotic evil", label: "Chaotic evil"},
        ];
    }

    onFieldChange(field, value) {
        let update = [];
        update[field] = value;
        this.props.setState(update);
    }

    render() {
        return <div>
        <h2 className="icon fa-user-secret">Character</h2>

        <div id="edit-character">
            <Panel id="description" header="Description">
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={this.props.name}
                        setState={
                            (value) => this.onFieldChange('name', value)
                        } />
                </ControlGroup>
                <ControlGroup labels={["Height", "ft."]}>
                    <InputField
                        placeholder="Height..."
                        value={this.props.height}
                        setState={(value) => {
                            value = parseFloat(value)
                            this.onFieldChange('height', value);
                        }} />
                </ControlGroup>
                <ControlGroup labels={["Weight", "lb."]}>
                    <InputField
                        placeholder="Weight..."
                        value={this.props.weight}
                        setState={(value) => {
                            value = parseFloat(value)
                            this.onFieldChange('height', value);
                        }} />
                </ControlGroup>
                <ControlGroup labels={["Age", "years old"]}>
                    <InputField
                        placeholder="Age..."
                        value={this.props.age}
                        setState={(value) => {
                            value = parseInt(value) || null;
                            this.onFieldChange('age', value);
                        }} />
                </ControlGroup>
                <ControlGroup label="Appearance">
                    <TextField
                        placeholder="Appearance..."
                        value={this.props.appearance}
                        rows={5}
                        setState={
                            (value) => this.onFieldChange('appearance', value)
                        } />
                </ControlGroup>
            </Panel>

            <Panel id="personality" header="Personality">
                <ControlGroup label="Gender">
                    <SingleSelect
                        emptyLabel="Gender..."
                        selected={this.props.gender}
                        items={this.genders}
                        setState={
                            (value) => this.onFieldChange('gender', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Alignment">
                    <SingleSelect
                        emptyLabel="Alignment..."
                        selected={this.props.alignment}
                        items={this.alignments}
                        setState={
                            (value) => this.onFieldChange('alignment', value)
                        } />
                </ControlGroup>
                {_.map({
                    'traits': 'Traits',
                    'ideals': 'Ideals',
                    'bonds': 'Bonds',
                    'flaws': 'Flaws'
                }, (label, field) => {
                    return <ControlGroup key={label} label={label}>
                    <TextField
                        placeholder={label + "..."}
                        value={this.props[field]}
                        rows={5}
                        setState={
                            (value) => this.onFieldChange(field, value)
                        } />
                </ControlGroup>})}
            </Panel>

            <Panel id="background" header="Backstory">
                <TextField
                    placeholder="Backstory..."
                    value={this.props.backstory}
                    rows={15}
                    setState={
                        (value) => this.onFieldChange('backstory', value)
                    } />
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
    </div>;
    }
}

export default RoutedObjectDataWrapper(
    CharacterEdit, "character"
);
