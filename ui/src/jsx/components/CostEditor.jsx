import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import LazyComponent from '../components/LazyComponent';
import TagValueContainer from '../components/TagValueContainer';

class CostEditor extends LazyComponent
{
    constructor(props) {
        super(props);
        this.coinage = [
            {id: 'cp', name: 'Copper'},
            {id: 'sp', name: 'Silver'},
            {id: 'ep', name: 'Electrum'},
            {id: 'gp', name: 'Gold'},
            {id: 'pp', name: 'Platinum'}
        ];
        this.state = {};
    }

    onSetState = (newValue) => {
        let value = {}
        try {
            value = _.mapValues(
                newValue,
                amount => {
                    if (amount === undefined) {
                        return amount;
                    }
                    const asNumber = parseInt(amount, 10);
                    if (_.isNaN(asNumber)) {
                        throw amount;
                    }
                    return asNumber;
                }
            );
        } catch(e) {
            this.setState({ value: newValue });
            return;
        }

        this.setState(
            { value: undefined },
            this.props.setState(value)
        );
    }

    render() {
        const {
            value: propValue,
            setState,
            ...props
        } = this.props;
        const {
            value = propValue
        } = this.state;

        return <TagValueContainer
            {...this.props}
            value={value}
            setState={this.onSetState}
            items={this.coinage}
            defaultValue={1}
        />;
    }
}

CostEditor.propTypes = {
    value: PropTypes.objectOf(
        PropTypes.number
    ).isRequired,
    setState: PropTypes.func,
};

CostEditor.defaultProps = {
    value: {},
    setState: null,
};

export default CostEditor;
