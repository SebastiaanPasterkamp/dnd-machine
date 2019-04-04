import React from 'react';
import _ from 'lodash';

class LazyComponent extends React.Component
{
    shouldComponentUpdate(nextProps, nextState) {
        if (!_.isEqual(this.props, nextProps)) {
            return true;
        }

        if (!_.isEqual(this.state, nextState)) {
            return true;
        }

        return false;
    }

    render() {
        return null;
    }
};

export default LazyComponent;