"use strict";

import '../sass/base.scss';

import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';

import UiActions from './actions/UiActions.jsx';


import ArmorEdit from './views/ArmorEdit.jsx';
import ArmorTable from './views/ArmorTable.jsx';
import CharacterEdit from './views/CharacterEdit.jsx';
import CharactersTable from './views/CharactersTable.jsx';
import EncounterTable from './views/EncounterTable.jsx';
import PartyEdit from './views/PartyEdit.jsx';
import PartyTable from './views/PartyTable.jsx';
import LanguageTable from './views/LanguagesTable.jsx';
import MonstersTable from './views/MonstersTable.jsx';
import NpcEdit from './views/NpcEdit.jsx';
import NpcTable from './views/NpcTable.jsx';
import SpellsTable from './views/SpellsTable.jsx';
import WeaponEdit from './views/WeaponEdit.jsx';
import WeaponsTable from './views/WeaponsTable.jsx';

import DefaultFilter from './views/DefaultFilter.jsx';
import Navigation from './views/Navigation.jsx';

let app = document.getElementById('app'),
    filter = document.getElementById('default-filter'),
    navigation = document.getElementById('navigation');

ReactDom.render(
    <Router><div>
        <header className="nice-header fixed">
            <div className="nice-header-container">
                <h1 className="nice-header-brand">
                    <Link to="/">
                        <img
                            src="/static/img/dungeons-and-dragons-logo.png"
                            height="35"
                            />
                    </Link>
                </h1>
                <div className="nice-header-collapse">

                    <DefaultFilter/>

                    <Navigation />
                </div>

                <button
                        type="button"
                        className="nice-header-toggle collapsed"
                        onClick={UiActions.toggleMenu}
                        >
                    <span className="icon-bar top-bar"></span>
                    <span className="icon-bar middle-bar"></span>
                    <span className="icon-bar bottom-bar"></span>
                </button>

            </div>
        </header>
        <section className="nice-fluid-container grid">
            <Switch>
                <Route
                    path="/items/armor/new"
                    component={ArmorEdit}
                    />
                <Route
                    path="/items/armor/edit/:id"
                    component={ArmorEdit}
                    />
                <Route
                    path="/items/armor/list"
                    component={ArmorTable}
                    />

                <Route
                    path="/character/list"
                    component={CharactersTable}
                    />
                <Route
                    path="/character/edit/:id"
                    component={CharacterEdit}
                    />
                <Route
                    path="/character/new"
                    component={CharacterEdit}
                    />

                <Route
                    path="/encounter/list"
                    component={EncounterTable}
                    />

                <Route
                    path="/monster/list"
                    component={MonstersTable}
                    />

                <Route
                    path="/party/list"
                    component={PartyTable}
                    />
                <Route
                    path="/party/edit/:id"
                    component={PartyEdit}
                    />

                <Route
                    path="/items/languages"
                    component={LanguageTable}
                    />
                <Route
                    path="/items/spells"
                    component={SpellsTable}
                    />

                <Route
                    path="/items/weapons/new"
                    component={WeaponEdit}
                    />

                <Route
                    path="/items/weapons/edit/:id"
                    component={WeaponEdit}
                    />
                <Route
                    path="/items/weapons/list"
                    component={WeaponsTable}
                    />

                <Route
                    path="/npc/list"
                    component={NpcTable}
                    />
                <Route
                    path="/npc/edit/:id"
                    component={NpcEdit}
                    />

                <Route render={({location}) => {
                    window.location.href = location.pathname;
                    return <div className="nice-modal info viewport-center">
                        <div className="nice-modal-content">
                            <div className="nice-modal-header">
                                <h4>Redirecting</h4>
                            </div>
                            <div className="nice-modal-body">
                                Redirecting to <code>{location.pathname}</code>.
                            </div>
                        </div>
                    </div>;
                }} />
            </Switch>
        </section>
    </div></Router>,
    document.getElementById('app')
);
