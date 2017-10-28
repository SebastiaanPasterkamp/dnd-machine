"use strict";

import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import LanguageTable from './views/Languages.jsx';
import WeaponsTable from './views/Weapons.jsx';
import DefaultFilter from './views/DefaultFilter.jsx';

let app = document.getElementById('app'),
    filter = document.getElementById('default-filter');

if (app) {
    ReactDom.render(
        <Router>
            <Switch>
                <Route path="/items/languages" component={LanguageTable} />
                <Route path="/items/weapons" component={WeaponsTable} />
            </Switch>
        </Router>,
        app
    );
}

if (filter) {
    ReactDom.render(
        <DefaultFilter/>,
        filter
    );
}