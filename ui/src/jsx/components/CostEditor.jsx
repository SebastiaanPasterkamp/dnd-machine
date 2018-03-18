import React from 'react';
import _ from 'lodash';

import LazyComponent from '../components/LazyComponent.jsx';
import TagValueContainer from '../components/TagValueContainer.jsx';

class CostEditor extends LazyComponent
{
    constructor(props) {
        super(props);
        this.coinage = [
            {'code': 'cp', 'label': 'Copper'},
            {'code': 'sp', 'label': 'Silver'},
            {'code': 'ep', 'label': 'Electrum'},
            {'code': 'gp', 'label': 'Gold'},
            {'code': 'pp', 'label': 'Platinum'}
        ];
        this.coins = _.range(1, 11)
            .map((i) => {
                return {code: i, label: i}
            });
    }

    render() {
        return <TagValueContainer
            {...this.props}
            tags={this.props.value || {}}
            tagOptions={this.coinage}
            defaultValue={1}
            />;
    }
}

export default CostEditor;