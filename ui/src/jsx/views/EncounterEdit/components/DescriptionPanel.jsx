import React from 'react';
import PropTypes from 'prop-types';
import {
    values,
} from 'lodash/fp';

import { memoize } from '../../../utils';

import ListDataWrapper from '../../../hocs/ListDataWrapper';
import ObjectDataListWrapper from '../../../hocs/ObjectDataListWrapper';

import ControlGroup from '../../../components/ControlGroup';
import InputField from '../../../components/InputField';
import Panel from '../../../components/Panel';
import SingleSelect from '../../../components/SingleSelect';
import MarkdownTextField from '../../../components/MarkdownTextField';

export class DescriptionPanel extends React.Component
{
    constructor(props) {
        super(props);
        this.memoize = memoize.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    onFieldChange(field) {
        const { setState } = this.props;
        return this.memoize(
            field,
            (value) => setState({ [field]: value })
        );
    }

    render() {
        const { campaign_id, campaigns, currentCampaign, name, description } = this.props;

        return (
            <Panel
                key="description"
                className="encounter-edit__description"
                header="Description"
            >
                <ControlGroup label="Campaign">
                    <SingleSelect
                        selected={campaign_id}
                        defaultValue={currentCampaign ? currentCampaign.id : null}
                        items={values(campaigns)}
                        renderEmpty="Shared"
                        setState={this.onFieldChange('campaign_id')}
                    />
                </ControlGroup>
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={name}
                        setState={this.onFieldChange('name')}
                    />
                </ControlGroup>
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={description}
                        rows={5}
                        setState={this.onFieldChange('description')}
                    />
                </ControlGroup>
            </Panel>
        );
    }
}

DescriptionPanel.propTypes = {
    setState: PropTypes.func.isRequired,
    campaign_id: PropTypes.number,
    campaigns: PropTypes.object,
    currentCampaign: PropTypes.object,
    name: PropTypes.string,
    description: PropTypes.string,
};

DescriptionPanel.defaultProps = {
    campaign_id: null,
    campaigns: {},
    currentCampaign: {},
    name: '',
    description: '',
};

export default ListDataWrapper(
    ObjectDataListWrapper(
        DescriptionPanel,
        {campaigns: {type: 'campaign'}}
    ),
    ['current_campaign'],
    null,
    { current_campaign: 'currentCampaign' }
);
