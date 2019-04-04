import React from 'react';
import PropTypes from 'prop-types';

import LazyComponent from '../LazyComponent.jsx';
import actions from '../../actions/CharacterEditorActions.jsx';

class AbilityScoreSelect extends LazyComponent
{
    componentDidMount() {
        actions.addAbilityScoreIncrease(this.props.limit);
    }

    componentWillUnmount() {
        actions.removeAbilityScoreIncrease(this.props.limit);
    }

    render() {
        return null;
    }
};

AbilityScoreSelect.propTypes = {
    limit: PropTypes.number.isRequired,
};

export default AbilityScoreSelect;
