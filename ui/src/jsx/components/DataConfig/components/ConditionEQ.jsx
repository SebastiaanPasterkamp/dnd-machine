import React from 'react';
import PropTypes from 'prop-types';

import ControlGroup from '../../ControlGroup';
import InputField from '../../InputField';

export class ConditionEQ extends React.Component
{
    conditionType = 'eq';

    constructor(props) {
        super(props);
        this.onPathChange = this.onPathChange.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
    }

    onPathChange(path) {
        const { setState } = this.props;
        setState({ type: this.conditionType, path });
    }

    onValueChange(value) {
        const { setState } = this.props;
        setState({ type: this.conditionType, value });
    }

    render() {
        const { path, value } = this.props;

        return (
            <ControlGroup labels={["Path", "≡"]}>
                <InputField
                    placeholder="Path..."
                    value={path}
                    type="text"
                    setState={this.onPathChange}
                />
                <InputField
                    type="number"
                    placeholder="EQ..."
                    value={value == null ? '' : value}
                    setState={this.onValueChange}
                />
            </ControlGroup>
        );
    }
};

ConditionEQ.propTypes = {
    type: PropTypes.oneOf(['eq']).isRequired,
    path: PropTypes.string,
    value: PropTypes.number,
};

ConditionEQ.defaultProps = {
    path: '',
    value: null,
};

export default ConditionEQ;
