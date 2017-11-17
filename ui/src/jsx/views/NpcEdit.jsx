import React from 'react';
import _ from 'lodash';

import LoadableContainer from '../mixins/LoadableContainer.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import StatsBlock from '../components/StatsBlock.jsx';
import TextField from '../components/TextField.jsx';

export class NpcEdit extends React.Component
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
        this.sizes = [
            {"code": "tiny", "label": "Tiny", "dice_size": 4},
            {"code": "small", "label": "Small", "dice_size": 6},
            {"code": "medium", "label": "Medium", "dice_size": 8},
            {"code": "large", "label": "Large", "dice_size": 10},
            {"code": "huge", "label": "Huge", "dice_size": 12},
            {"code": "gargantuan", "label": "Gargantuan", "dice_size": 20}
        ];
        this.levels = _.range(1, 30)
            .map((i) => {
                return {code: i, label: i}
            });
    }

    onFieldChange(field, value) {
        let update = [];
        update[field] = value;
        this.props.setState(update);
    }

    onStatisticsChange(update) {
        let statistics = _.merge(this.props.statistics, update);
        this.props.setState({statistics: statistics});
    }

    render() {
        return <div>
        <h2 className="icon fa-commenting-o">NPC</h2>

        <div id="edit-npc">
            <Panel id="description" header="Description">
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={this.props.name}
                        setState={
                            (value) => this.onFieldChange('name', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Location">
                    <InputField
                        placeholder="Location..."
                        value={this.props.location}
                        setState={
                            (value) => this.onFieldChange('location', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Organization">
                    <InputField
                        placeholder="Organization..."
                        value={this.props.organization}
                        setState={
                            (value) => this.onFieldChange('organization', value)
                        } />
                </ControlGroup>
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
                <ControlGroup labels={["Size", "ft."]}>
                    <SingleSelect
                        emptyLabel="Size..."
                        selected={this.props.size}
                        items={this.sizes}
                        setState={
                            (value) => this.onFieldChange('size', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Level">
                    <SingleSelect
                        emptyLabel="Level..."
                        selected={this.props.level}
                        items={this.levels}
                        setState={
                            (value) => this.onFieldChange('level', value)
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

            <Panel id="statistics" header="Statistics">
                <StatsBlock
                    {...this.props.statistics}
                    budget={50}
                    setState={
                        (update) => this.onStatisticsChange(update)
                    } />
            </Panel>

            <Panel id="save" header="Save">
                <ButtonField
                    name="button"
                    value="cancel"
                    color="muted"
                    icon="ban"
                    label="Cancel" />
                {this.props.reload
                    ? <ButtonField
                        name="button"
                        value="cancel"
                        color="info"
                        icon="refresh"
                        onClick={() => this.props.reload()}
                        label="Update" />
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

class LoadableNpcEdit extends React.Component
{
    render() {
        return <LoadableContainer
            loadableType="npc"
            component={NpcEdit}
            {...this.props}
            />;
    }
}

export default LoadableNpcEdit;