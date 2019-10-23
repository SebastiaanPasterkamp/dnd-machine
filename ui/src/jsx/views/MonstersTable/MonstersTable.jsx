import React from 'react';
import PropTypes from 'prop-types';
import {
    contains,
    filter,
} from 'lodash/fp';

import './sass/_monsters-table.scss';

import ListDataWrapper from '../../hocs/ListDataWrapper';
import ObjectDataListWrapper from '../../hocs/ObjectDataListWrapper';
import ResponsiveTable from '../../components/ResponsiveTable';

import MonstersFilter from './components/MonstersFilter';
import TableHeader from './components/TableHeader';
import TableRow from './components/TableRow';
import TableFooter from './components/TableFooter';

class MonstersTable extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            campaign: [],
            size: [],
            type: [],
            alignment: [],
            level: [],
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
        const { monsters, search } = this.props;
        const {
            text, campaign, size, type, alignment, level, cr, xp,
        } = {...this.state, ...update}

        const pattern = new RegExp(search || text, "i");

        this.setState({
            ...update,
            items: filter(
                (monster) => (
                    (
                        monster.name
                        && monster.name.match(pattern)
                    ) && (
                        !campaign.length
                        || contains(monster.campaign_id, campaign)
                    ) && (
                        !size.length
                        || contains(monster.size, size)
                    ) && (
                        !type.length
                        || contains(monster.type, type)
                    ) && (
                        !alignment.length
                        || contains(monster.alignment, alignment)
                    ) && (
                        !level.length
                        || contains(monster.level, level)
                    ) && (
                        !cr.min
                        || monster.challenge_rating >= cr.min
                    ) && (
                        !cr.max
                        || monster.challenge_rating <= cr.max
                    ) && (
                        !xp.min
                        || monster.xp >= xp.min
                    ) && (
                        !xp.max
                        || monster.xp <= xp.max
                    )
                )
            )(monsters),
        });
    }

    render() {
        const { monsters } = this.props;
        const { items = monsters, ...filters } = this.state;

        return (
            <div className="monsters-table">
                <h2 className="icon fa-paw">Monster list</h2>
                <MonstersFilter
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

MonstersTable.propTypes = {
    monsters: PropTypes.objectOf( PropTypes.shape({
        id: PropTypes.number.isRequired,
    }) ),
    search: PropTypes.string,
};

MonstersTable.defaultProps = {
    monsters: {},
    search: '',
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        MonstersTable,
        {monsters: {type: 'monster'}}
    ),
    ['search']
);
