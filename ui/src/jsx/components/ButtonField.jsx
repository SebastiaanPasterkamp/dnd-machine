import React from 'react';
import PropTypes from 'prop-types';

import utils from '../utils.jsx';

import LazyComponent from './LazyComponent.jsx';

export class ButtonField extends LazyComponent
{
    render() {
        const {
            color, icon, className, label, ...buttonProps
        } = this.props
        const style = utils.makeStyle({
            [color]: color,
            'icon': icon,
            ['fa-' + icon]: icon
        }, ['nice-btn', className]);

        return <button
                {...buttonProps}
                className={style}
                >
            {label}
        </button>
    }
}

ButtonField.defaultProps = {
    label: "Button",
    onClick: () => {
        console.log(['ButtonField']);
    }
};

ButtonField.propTypes = {
    label: PropTypes.string,
    color: PropTypes.string,
    icon: PropTypes.string,
    className: PropTypes.string
};

export default ButtonField;
