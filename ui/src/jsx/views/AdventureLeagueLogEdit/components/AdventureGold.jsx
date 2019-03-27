import React from 'react';
import PropTypes from 'prop-types';
import { mergeWith } from 'lodash/fp';

import Coinage from '../../../components/Coinage.jsx';
import ControlGroup from '../../../components/ControlGroup.jsx';
import CostEditor from '../../../components/CostEditor.jsx';
import Panel from '../../../components/Panel.jsx';

export class AdventureGold extends React.PureComponent
{
    constructor(props) {
        super(props);
        this.state = {};
    }

    onChange = (earned) => {
        const { starting, disabled, setState } = this.props;
        if (disabled) {
            return;
        }

        const total = mergeWith(
            (dst, src) => ((dst || 0) + src),
            starting,
            earned,
        );
        this.setState(
            { total },
            () => setState({ starting, earned, total })
        );
    }

    render() {
        const {
            starting, earned, total, className, label, disabled,
        } = this.props;

        return (
            <Panel
                className={className}
                header={label}
            >
                <ControlGroup label="Starting">
                    <Coinage
                        {...starting}
                        className="nice-form-control"
                        extended="1"
                    />
                </ControlGroup>

                <ControlGroup label="Earned">
                    <CostEditor
                        value={earned}
                        disabled={disabled}
                        setState={this.onChange}
                    />
                </ControlGroup>

                <ControlGroup label="Total">
                    <Coinage
                        {...total}
                        className="nice-form-control"
                        extended="1"
                    />
                </ControlGroup>
            </Panel>
        );
    }
};

AdventureGold.propTypes = {
    setState: PropTypes.func,
    label: PropTypes.string.isRequired,
    starting: PropTypes.objectOf(PropTypes.number),
    earned: PropTypes.objectOf(PropTypes.number),
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

AdventureGold.defaultProps = {
    starting: {},
    earned: {},
    className: '',
    disabled: false,
};

export default AdventureGold;
