import React from 'react';
import { isEqual } from 'lodash/fp';

class LazyComponent extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!isEqual(this.props, nextProps)) {
            return true;
        }

        if (!isEqual(this.state, nextState)) {
            return true;
        }

        return false;
    }

    render() {
        return null;
    }
};

export default LazyComponent;
