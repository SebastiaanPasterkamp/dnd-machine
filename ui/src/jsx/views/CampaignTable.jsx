import React from 'react';
import MDReactComponent from 'markdown-react-js';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import CampaignLinks from '../components/CampaignLinks.jsx';

class CampaignHeader extends React.Component
{
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <thead key="thead">
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
        </thead>;
    }
}

class CampaignFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan="2"></td>
                <td>
                    <CampaignLinks
                        altStyle={true}
                        buttons={['new']}
                        />
                </td>
            </tr>
        </tbody>
    }
};

class CampaignRow extends LazyComponent
{
    render() {
        return <tr
                data-name={this.props.name}>
            <td>{this.props.name}</td>
            <td>
                <MDReactComponent
                    text={this.props.description} />
            </td>
            <td>{this.props.id != null
                ? <CampaignLinks
                    altStyle={true}
                    buttons={['view', 'edit']}
                    campaign_id={this.props.id}
                    />
                : null
            }</td>
        </tr>
    }
};

class CampaignTable extends LazyComponent
{
    shouldDisplayRow(pattern, campaign) {
        return (
            (campaign.name && campaign.name.search(pattern) >= 0)
            || (campaign.description && campaign.description.search(pattern) >= 0)
        );
    }

    render() {
        if (this.props.campaigns == null) {
            return null;
        }
        let pattern = new RegExp(this.props.search || '', "i");

        return <div>
            <h2 className="icon fa-commenting-o">NPC list</h2>
            <table className="nice-table condensed bordered responsive">
                <CampaignHeader />
                <tbody key="tbody">
                    {_.map(this.props.campaigns, (campaign) => {
                        return this.shouldDisplayRow(pattern, campaign)
                            ? <CampaignRow
                                key={campaign.id}
                                {...campaign}
                                />
                            : null;
                    })}
                </tbody>
                <CampaignFooter />
            </table>
        </div>;
    }
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        CampaignTable,
        {campaigns: {type: 'campaign'}}
    ),
    ['search']
);
