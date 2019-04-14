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
            </tr>
        </thead>;
    }
}

class CampaignFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan={2}>
                    <CampaignLinks
                        altStyle={true}
                    />
                </td>
            </tr>
        </tbody>
    }
};

class CampaignRow extends LazyComponent
{
    render() {
        const {
            id, name, description = ''
        } = this.props;

        return <tr data-id={id}>
            <th>
                {name}
                <CampaignLinks
                    altStyle={true}
                    id={id}
                />
            </th>
            <td>
                <MDReactComponent
                    text={description} />
            </td>
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
        const {
            campaigns, search = ''
        } = this.props;

        if (!campaigns) {
            return null;
        }

        let pattern = new RegExp(search, "i");
        const filtered = _.filter(
            campaigns,
            (campaign) => this.shouldDisplayRow(pattern, campaign)
        );

        return <div>
            <h2 className="icon fa-commenting-o">NPC list</h2>
            <table className="nice-table condensed bordered responsive">
                <CampaignHeader />
                <tbody key="tbody">
                {_.map(filtered, (campaign) => (
                    <CampaignRow
                        key={campaign.id}
                        {...campaign}
                        />
                ))}
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
