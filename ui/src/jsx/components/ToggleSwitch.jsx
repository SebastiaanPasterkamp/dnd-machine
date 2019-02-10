import React from 'react';
import _ from 'lodash';

import utils from '../utils.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

class ToggleSwitch extends LazyComponent
{
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
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
            className,
            id = `toggle-${_.uniqueId()}`,
            disabled,
        } = this.props;

        const style = utils.makeStyle({
            'muted': disabled,
        }, ['nice-toggle-btn', className]);

        return (
            <React.Fragment>
                <input
                    type="checkbox"
                    className="nice-toggle"
                    id={id}
                    checked={checked}
                    disabled={disabled}
                    onChange={disabled ? null : this.onChange}
                />
                <label
                    className={style}
                    htmlFor={id}
                >
                    {label}
                </label>
            </React.Fragment>
        );
    }
}

export default ToggleSwitch;