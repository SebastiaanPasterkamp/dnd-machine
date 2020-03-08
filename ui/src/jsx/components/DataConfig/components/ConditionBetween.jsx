import React from 'react';
import PropTypes from 'prop-types';

import ControlGroup from '../../ControlGroup';
import InputField from '../../InputField';

export class ConditionBetween extends React.Component
{
    conditionType = 'between';

    constructor(props) {
        super(props);
        this.onPathChange = this.onPathChange.bind(this);
        this.onMinChange = this.onMinChange.bind(this);
        this.onMaxChange = this.onMaxChange.bind(this);
    }

    onPathChange(path) {
        const { setState } = this.props;
        setState({ type: this.conditionType, path });
    }

    onMinChange(min) {
        const { setState, max = min } = this.props;
        setState({
            type: this.conditionType,
            min,
            max: min > max ? min : max,
        });
    }

    onMaxChange(max) {
        const { setState, min = max } = this.props;
        setState({
            type: this.conditionType,
            min: min < max ? min : max,
            max,
        });
    }

    render() {
        const { path, min, max } = this.props;

        return (
            <ControlGroup labels={["Path", "Between", "and"]}>
                <InputField
                    placeholder="Path..."
                    value={path}
                    type="text"
                    setState={this.onPathChange}
                />
                <InputField
                    type="number"
                    placeholder="Min..."
                    value={min == null ? '' : min}
                    setState={this.onMinChange}
                />
                <InputField
                    type="number"
                    placeholder="Normal..."
                    value={max == null ? '' : max}
                    setState={this.onMaxChange}
                />
            </ControlGroup>
        );
    }
};

ConditionBetween.propTypes = {
    type: PropTypes.oneOf(['between']).isRequired,
    path: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
};

ConditionBetween.defaultProps = {
    path: '',
    min: undefined,
    max: undefined,
};

export default ConditionBetween;
