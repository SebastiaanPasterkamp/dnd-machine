import React from 'react';
import PropTypes from 'prop-types';
import {
    contains,
    filter,
} from 'lodash/fp';

import './sass/_encounters-table.scss';

import utils from '../../utils';
import ListDataWrapper from '../../hocs/ListDataWrapper';
import ObjectDataListWrapper from '../../hocs/ObjectDataListWrapper';
import ResponsiveTable from '../../components/ResponsiveTable';

import EncountersFilter from './components/EncountersFilter';
import TableHeader from './components/TableHeader';
import TableRow from './components/TableRow';
import TableFooter from './components/TableFooter';

export class EncountersTable extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            campaign: [],
            cr: {
                min: null,
                max: null,
            },
            xp: {
                min: null,
                max: null,
            },
        };

        this.updateFilter = this.updateFilter.bind(this);
    }

    updateFilter(update) {
        const { encounters, search } = this.props;
        const {
            text, campaign, cr, xp,
        } = {...this.state, ...update}

        const pattern = new RegExp(search || text, "i");

        this.setState({
            ...update,
            items: filter(
                (encounter) => (
                    (
                        (
                            encounter.name
                            && encounter.name.match(pattern)
                        ) || (
                            encounter.description
                            && encounter.description.match(pattern)
                        )
                    ) && (
                        !campaign.length
                        || contains(encounter.campaign_id, campaign)
                    ) && (
                        !cr.min
                        || encounter.challenge_rating >= cr.min
                    ) && (
                        !cr.max
                        || encounter.challenge_rating <= cr.max
                    ) && (
                        !xp.min
                        || encounter.xp >= xp.min
                    ) && (
                        !xp.max
                        || encounter.xp <= xp.max
                    )
                )
            )(encounters),
        });
    }

    render() {
        const { encounters } = this.props;
        const { items = encounters, ...filters } = this.state;

        return (
            <div className="encounter-table">
                <h2 className="icon fa-gamepad">Encounter list</h2>
                <EncountersFilter
                    {...filters}
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
};

EncountersTable.propTypes = {
    encounters: PropTypes.objectOf( PropTypes.shape({
        id: PropTypes.number.isRequired,
    }) ),
    search: PropTypes.string,
};

EncountersTable.defaultProps = {
    encounters: {},
    search: '',
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        EncountersTable,
        {encounters: {type: 'encounter'}}
    ),
    ['search']
);
