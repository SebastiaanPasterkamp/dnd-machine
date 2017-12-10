import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

var UiActions = Reflux.createActions({
    "toggleMenu": {},
});

let showMenu = false;
UiActions.toggleMenu.listen(() => {
    showMenu = !showMenu;

    document
        .querySelectorAll('.nice-header .nice-header-toggle')
        .forEach((header) => {
            header
                .classList
                .toggle('collapsed', !showMenu);
        });

    document
        .getElementsByTagName('body')[0]
        .classList
        .toggle('expanded', showMenu);
});

export default UiActions;
