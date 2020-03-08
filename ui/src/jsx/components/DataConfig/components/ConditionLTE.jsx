import React from 'react';
import PropTypes from 'prop-types';

import ControlGroup from '../../ControlGroup';
import InputField from '../../InputField';

export class ConditionLTE extends React.Component
{
    conditionType = 'lte';

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
            <ControlGroup labels={["Path", "≤"]}>
                <InputField
                    placeholder="Path..."
                    value={path}
                    type="text"
                    setState={this.onPathChange}
                />
                <InputField
                    type="number"
                    placeholder="LTE..."
                    value={value == null ? '' : value}
                    setState={this.onValueChange}
                />
            </ControlGroup>
        );
    }
};

ConditionLTE.propTypes = {
    type: PropTypes.oneOf(['lte']).isRequired,
    path: PropTypes.string,
    value: PropTypes.number,
};

ConditionLTE.defaultProps = {
    path: '',
    value: null,
};

export default ConditionLTE;
