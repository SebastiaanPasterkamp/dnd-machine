import React from 'react';
import PropTypes from 'prop-types';

import LazyComponent from '../LazyComponent.jsx';

class AbilityScoreSelect extends LazyComponent
{
    componentDidMount() {
        this.props.onChange(
            null,
            this.props.limit
        );
    }

    componentWillUnmount() {
        this.props.onChange(
            null,
            undefined
        );
    }

    render() {
        return null;
    }
};

AbilityScoreSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    limit: PropTypes.number.isRequired,
};

export default AbilityScoreSelect;
