import React from 'react';

class LazyComponent extends React.Component
{
    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.props != nextProps
            || this.state != nextState
        );
    }

    render() {
        return null;
    }
};

export default LazyComponent;