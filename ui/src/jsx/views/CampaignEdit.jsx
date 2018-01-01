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
        return <div>
        <h2 className="icon fa-book">campaign</h2>

        <div className="edit-campaign">
            <Panel id="description" header="Description">
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

            <MarkdownTextField
                className="splitview edit-campaign__story"
                placeholder="Story..."
                value={this.props.story}
                rows={5}
                setState={(value) => {
                    this.onFieldChange('story', value);
                }} />
        </div>
    </div>;
    }
}

export default RoutedObjectDataWrapper(
    CampaignEdit, "campaign"
);
