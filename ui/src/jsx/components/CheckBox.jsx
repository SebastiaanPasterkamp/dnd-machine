import React from 'react';

import utils from '../utils.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

class CheckBox extends LazyComponent
{
    render() {
        const style = utils.makeStyle({
            'fa-check-square-o': this.props.isChecked,
            'fa-square-o': !this.props.isChecked,
        }, ['icon']);

        return <span className={style}>&nbsp;</span>;
    }
}

export default CheckBox;