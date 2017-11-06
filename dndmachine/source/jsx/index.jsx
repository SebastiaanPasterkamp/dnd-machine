"use strict";

import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import ArmorTable from './views/ArmorTable.jsx';
import LanguageTable from './views/LanguagesTable.jsx';
import NpcEdit from './views/NpcEdit.jsx';
import SpellsTable from './views/SpellsTable.jsx';
import WeaponsTable from './views/WeaponsTable.jsx';
import DefaultFilter from './views/DefaultFilter.jsx';

let app = document.getElementById('app'),
    filter = document.getElementById('default-filter');

if (app) {
    ReactDom.render(
        <Router>
            <Switch>
                <Route path="/items/armor" component={ArmorTable} />
                <Route path="/items/languages" component={LanguageTable} />
                <Route path="/items/spells" component={SpellsTable} />
                <Route path="/items/weapons" component={WeaponsTable} />
                <Route path="/npc/edit" component={NpcEdit} />
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

