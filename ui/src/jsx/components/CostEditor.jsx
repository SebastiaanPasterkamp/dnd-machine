import React from 'react';
import _ from 'lodash';

import LazyComponent from '../components/LazyComponent.jsx';
import TagValueContainer from '../components/TagValueContainer.jsx';

class CostEditor extends LazyComponent
{
    constructor(props) {
        super(props);
        this.coinage = [
            {code: 'cp', label: 'Copper'},
            {code: 'sp', label: 'Silver'},
            {code: 'ep', label: 'Electrum'},
            {code: 'gp', label: 'Gold'},
            {code: 'pp', label: 'Platinum'}
        ];
    }

    render() {
        const { value = {}, ...props } = this.props;

        return <TagValueContainer
            {...this.props}
            items={this.coinage}
            defaultValue={1}
            />;
    }
}

export default CostEditor;