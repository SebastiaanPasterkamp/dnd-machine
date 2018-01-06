import React from 'react';
import _ from 'lodash';

import '../../sass/_edit-character.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import StatsBlock from '../components/StatsBlock.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import Progress from '../components/Progress.jsx';

export class CharacterEdit extends React.Component
{
    onFieldChange(field, value) {
        this.props.setState({
            [field]: value
        });
    }

    render() {
        return <div>
        <h2 className="icon fa-user-secret">Character</h2>

        <div id="edit-character">
            <Panel id="description" header="Description">
                Level {this.props.level} {this.props.class} {this.props.race} ({this.props.background})
                <Progress
                    value={this.props.xp_progress}
                    total={this.props.xp_level}
                    color={"good"}
                    labels={[
                        {
                            value: 0.30,
                            label: this.props.xp_progress
                                + " / "
                                + this.props.xp_level
                        },
                        {
                            value: 0.20,
                            label: this.props.xp_progress
                        },
                        {
                            value: 0.10,
                            label: this.props.level
                        }
                    ]}
                    />
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={this.props.name}
                        setState={
                            (value) => this.onFieldChange('name', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Alignment">
                    <SingleSelect
                        emptyLabel="Alignment..."
                        selected={this.props.alignment}
                        items={this.props.alignments}
                        setState={
                            (value) => this.onFieldChange('alignment', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Gender">
                    <SingleSelect
                        emptyLabel="Gender..."
                        selected={this.props.gender}
                        items={this.props.genders}
                        setState={
                            (value) => this.onFieldChange('gender', value)
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
                    <MarkdownTextField
                        placeholder="Appearance..."
                        value={this.props.appearance}
                        rows={5}
                        setState={
                            (value) => this.onFieldChange('appearance', value)
                        } />
                </ControlGroup>
            </Panel>

            <Panel id="personality" header="Personality">
                {_.map({
                    'traits': 'Traits',
                    'ideals': 'Ideals',
                    'bonds': 'Bonds',
                    'flaws': 'Flaws'
                }, (label, field) => {
                    return <ControlGroup key={label} label={label}>
                    <MarkdownTextField
                        placeholder={label + "..."}
                        value={this.props[field]}
                        rows={5}
                        setState={
                            (value) => this.onFieldChange(field, value)
                        } />
                </ControlGroup>})}
            </Panel>

            <Panel id="background" header="Backstory">
                <MarkdownTextField
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

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        CharacterEdit, "character"
    ),
    ['alignments', 'genders'],
    'items'
);
