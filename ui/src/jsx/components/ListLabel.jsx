import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

import _ from 'lodash';

class ListLabel extends LazyComponent
{
    getLabel() {
        let label = this.props.emptyLabel;
        let item = _.find(this.props.items || [], {
            code: this.props.value
        });
        if (
            !_.isNil(item)
            && !_.isNil(item.code)
        ) {
            label = item.label;
        }
        return label;
    }

    render() {
        return <div className="list-label inline">
            {this.getLabel()}
        </div>;
    }
}

export default ListLabel;