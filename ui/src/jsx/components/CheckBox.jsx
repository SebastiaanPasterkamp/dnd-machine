import React from 'react';

import utils from '../utils.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

class CheckBox extends LazyComponent
{
    render() {
        const { isChecked } = this.props;

        const style = utils.makeStyle({
            'fa-check-square-o': isChecked,
            'fa-square-o': !isChecked,
        }, ['icon']);

        return <span className={style}>&nbsp;</span>;
    }
}

export default CheckBox;