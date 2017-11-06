import React from 'react';
import Reflux from 'reflux';

import listDataActions from '../actions/listDataActions.jsx';
import DataStore from '../stores/dataStore.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import StatsBlock from '../components/StatsBlock.jsx';

class NpcEdit extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.store = DataStore;
        this.storeKeys = [];
        this.state = {
            statistics: {
                bare: {strength: 8, dexterity: 9, constitution: 10, intelligence: 11, wisdom: 12, charisma: 13},
                base: {strength: 9, dexterity: 11, constitution: 10, intelligence: 11, wisdom: 12, charisma: 13},
                bonus: {strength: 1, dexterity: 2},
                modifiers: {strength: -1, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 1, charisma: 1}
            }
        };
    }

    onStatisticsChange(update) {
        var statistics = _.merge(this.state.statistics, update);
        this.setState({statistics: statistics});
    }

    render() {
        return <div>
            <h2 className="icon fa-commenting-o">NPC</h2>
            <StatsBlock
                {...this.state.statistics}
                budget={27}
                increase={2}
                setState={(update) => this.onStatisticsChange(update)} />,
        </div>
    }
}

export default NpcEdit;