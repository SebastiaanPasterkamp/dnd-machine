import React from 'react';
import _ from 'lodash';

import '../../sass/_edit-campaign.scss';

import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import Panel from '../components/Panel.jsx';

export class CampaignEdit extends React.Component
{
    constructor(props) {
        super(props);
    }

    onFieldChange(field, value) {
        this.props.setState({
            [field]: value
        });
    }

    render() {
        return [
            <Panel
                    key="description"
                    className="campaign-edit__description"
                    header="Description"
                >
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={this.props.name}
                        setState={(value) => {
                            this.onFieldChange('name', value);
                        }} />
                </ControlGroup>
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={this.props.description}
                        rows={5}
                        setState={(value) => {
                            this.onFieldChange('description', value);
                        }} />
                </ControlGroup>
            </Panel>,

            <MarkdownTextField
                key="story"
                className="splitview campaign-edit__story"
                placeholder="Story..."
                value={this.props.story}
                rows={5}
                setState={(value) => {
                    this.onFieldChange('story', value);
                }} />
        ];
    }
}

export default RoutedObjectDataWrapper(
    CampaignEdit, {
        className: 'campaign-edit',
        icon: 'fa-book',
        label: 'Campaign',
        buttons: ['cancel', 'reload', 'save']
    }, "campaign"
);
