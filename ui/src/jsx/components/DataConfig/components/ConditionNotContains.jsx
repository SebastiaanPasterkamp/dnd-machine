import React from 'react';
import PropTypes from 'prop-types';

import ControlGroup from '../../ControlGroup';
import InputField from '../../InputField';

export class ConditionNotContains extends React.Component
{
    conditionType = 'notcontains';

    constructor(props) {
        super(props);
        this.onPathChange = this.onPathChange.bind(this);
        this.onNeedleChange = this.onNeedleChange.bind(this);
    }

    onPathChange(path) {
        const { setState } = this.props;
        setState({ type: this.conditionType, path });
    }

    onNeedleChange(needle) {
        const { setState } = this.props;
        setState({
            type: this.conditionType,
            needle: `${needle}`.match(/^\d+(?:\.\d+)?$/)
                ? parseInt(needle)
                : needle,
        });
    }

    render() {
        const { path, needle } = this.props;

        return (
            <ControlGroup labels={["Path", "∌"]}>
                <InputField
                    placeholder="Path..."
                    value={path}
                    type="text"
                    setState={this.onPathChange}
                />
                <InputField
                    type="needle"
                    placeholder="Needle..."
                    value={needle != null ? needle : ''}
                    setState={this.onNeedleChange}
                />
            </ControlGroup>
        );
    }
};

ConditionNotContains.propTypes = {
    type: PropTypes.oneOf(['notcontains']).isRequired,
    path: PropTypes.string,
    needle: PropTypes.any,
};

ConditionNotContains.defaultProps = {
    path: '',
    needle: null,
};

export default ConditionNotContains;
