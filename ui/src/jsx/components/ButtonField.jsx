import React from 'react';
import _ from 'lodash';

import LazyComponent from './LazyComponent.jsx';

export class ButtonField extends LazyComponent
{
    onChange(value) {
        this.props.setState(value);
    }

    render() {
        let style = _.filter([
            'nice-btn',
            'color' in this.props ? this.props.color : null,
            'icon' in this.props ? "icon" : null,
            'icon' in this.props ? "fa-" + this.props.icon : null
            ]);

        return <button
                className={style.length ? style.join(' ') : null}
                {...this.props}>
            {this.props.label || "Button"}
        </button>
    }
}

ButtonField.defaultProps = {
    onClick: () => {
        console.log(['ButtonField']);
    }
};

export default ButtonField;