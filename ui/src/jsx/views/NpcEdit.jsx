import React from 'react';
import _ from 'lodash';

import '../../sass/_edit-npc.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import StatsBlock from '../components/StatsBlock.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';

export class NpcEdit extends React.Component
{
    constructor(props) {
        super(props);

        this.genders = [
            {code: "male", label: "Male"},
            {code: "female", label: "Female"},
            {code: "genderless", label: "genderless"},
        ];
        this.levels = _.range(1, 30)
            .map((i) => {
                return {code: i, label: i}
            });
    }

    onFieldChange(field, value) {
        this.props.setState({
            [field]: value
        });
    }

    onStatisticsChange(value) {
        let update = Object.assign({}, this.props.statistics, value);
        this.props.setState({
            statistics: update
        });
    }

    render() {
        return [
            <Panel
                    key="description"
                    className="npc-edit__description"
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
                        items={this.props.alignments}
                        setState={
                            (value) => this.onFieldChange('alignment', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Size">
                    <SingleSelect
                        emptyLabel="Size..."
                        selected={this.props.size}
                        items={this.props.size_hit_dice}
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
                    key="statistics"
                    className="npc-edit__statistics" header="Statistics"
                >
                <StatsBlock
                    {...this.props.statistics}
                    budget={50}
                    setState={
                        (update) => this.onStatisticsChange(update)
                    } />
            </Panel>
        ];
    }
}

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        NpcEdit, {
            className: 'npc-edit',
            icon: 'fa-commenting-o',
            label: 'NPC',
            buttons: ['cancel', 'reload', 'recompute', 'save']
        }, "npc"
    ),
    ['alignments', 'size_hit_dice'],
    'items'
);
