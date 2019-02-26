import React from 'react';
import PropTypes from 'prop-types';
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
        this.state = {};
    }

    onSetState = (newValue) => {
        let value = {}
        try {
            value = _.mapValues(
                newValue,
                amount => {
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