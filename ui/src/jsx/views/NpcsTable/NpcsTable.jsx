import React from 'react';
import PropTypes from 'prop-types';
import {
    contains,
    filter,
} from 'lodash/fp';

import './sass/_npcs-table.scss';

import ListDataWrapper from '../../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../../hocs/ObjectDataListWrapper.jsx';
import ResponsiveTable from '../../components/ResponsiveTable';

import NpcsFilter from './components/NpcsFilter';
import TableHeader from './components/TableHeader';
import TableRow from './components/TableRow';
import TableFooter from './components/TableFooter';

class NpcsTable extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            campaign: [],
            alignment: [],
        };

        this.updateFilter = this.updateFilter.bind(this);
    }

    updateFilter(update) {
        this.setState(update);
    }

    static getDerivedStateFromProps(props, state) {
        const { npcs, search } = props;
        const {
            text, campaign, alignment,
        } = state;

        const pattern = new RegExp(text || search, "i");

        return {
            items: filter(
                (npc) => (
                    (
                        (
                            npc.name
                            && npc.name.match(pattern)
                        ) || (
                            npc.location
                            && npc.location.match(pattern)
                        ) || (
                            npc.organization
                            && npc.organization.match(pattern)
                        ) || (
                            npc.race
                            && npc.race.match(pattern)
                        ) || (
                            npc.class
                            && npc.class.match(pattern)
                        )
                    ) && (
                        !campaign.length
                        || contains(npc.campaign_id, campaign)
                    ) && (
                        !alignment.length
                        || contains(npc.alignment, alignment)
                    )
                )
            )(npcs)
        };
    }

    render() {
        const { items } = this.state;

        return (
            <div className="npcs-table">
                <h2 className="icon fa-paw">NPC list</h2>
                <NpcsFilter
                    {...this.state}
                    setState={this.updateFilter}
                />
                <ResponsiveTable
                    headerComponent={TableHeader}
                    rowComponent={TableRow}
                    footerComponent={TableFooter}
                    items={items}
                />
            </div>
        );
    }
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        NpcsTable,
        {npcs: {type: 'npc'}}
    ),
    ['search']
);
