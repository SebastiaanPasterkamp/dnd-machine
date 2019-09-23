import React from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash/fp';

import utils from '../utils.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

class ToggleSwitch extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            style: 'nice-toggle',
        };
        this.onChange = this.onChange.bind(this);
        this.switchId = `toggle-${uniqueId()}`;
    }

    static getDerivedStateFromProps(props, state) {
        const { className, disabled } = props;
        const style = utils.makeStyle(
            {
                'muted': disabled,
                [className]: className && !disabled,
            },
            ["nice-toggle"]
        );
        if (style !== state.style) {
            return { style };
        }
        return null;
    }

    onChange() {
        const {
            checked,
            onChange,
        } = this.props;

        onChange(!checked);
    }

    render() {
        const {
            checked,
            label,
            switchId = this.switchId,
            disabled,
        } = this.props;
        const { style } = this.state;

        return (
            <React.Fragment>
                <input
                    type="checkbox"
                    className={style}
                    id={switchId}
                    checked={checked}
                    disabled={disabled}
                    onChange={disabled ? null : this.onChange}
                />
                <label
                    className="nice-toggle-btn"
                    htmlFor={switchId}
                >
                    {label}
                </label>
            </React.Fragment>
        );
    }
}

ToggleSwitch.propTypes = {
    checked: PropTypes.bool.isRequired,
    label: PropTypes.node.isRequired,
    switchId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    disabled: PropTypes.bool,
};

export default ToggleSwitch;
