import React from 'react';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import {
    forEach,
    isEqual,
    uniqueId,
} from 'lodash/fp';

import StatsBlock from '../../StatsBlock';

import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper';

export class StatisticsSelect extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.onStatisticsChange = this.onStatisticsChange.bind(this);
        this.onManualChange = this.onManualChange.bind(this);
    }

    onStatisticsChange({ bare, base, bonus, modifiers }) {
        const { setState, improvement } = this.props;
        setState({ bare, base, bonus, modifiers, improvement });
    }

    onManualChange({ bare, improvement }) {
        const { setState, base, bonus, modifiers } = this.props;
        setState({ bare, base, bonus, modifiers, improvement });
    }

    render() {
        const {
            type, uuid, setState,
            limit,
            ...props
        } = this.props;

        return (
            <StatsBlock
                increase={ limit }
                budget={ 27 }
                minBare={ 8 }
                maxBare={ 15 }
                {...props}
                setState={ this.onStatisticsChange }
                manualChange={ this.onManualChange }
            />
        );
    }
};

StatisticsSelect.propTypes = {
    type: PropTypes.oneOf(['ability_score', 'statistics']).isRequired,
    uuid: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    limit: PropTypes.number,
    editBase: PropTypes.bool,
};

StatisticsSelect.defaultProps = {
    editBase: false,
    limit: 0,
    path: 'character.statistics',
};

export default CharacterEditorWrapper(StatisticsSelect);
