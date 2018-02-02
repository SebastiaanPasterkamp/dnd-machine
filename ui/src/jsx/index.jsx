"use strict";

import '../sass/base.scss';

import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';

import UiActions from './actions/UiActions.jsx';
import ListDataWrapper from './hocs/ListDataWrapper.jsx';

import ArmorEdit from './views/ArmorEdit.jsx';
import ArmorTable from './views/ArmorTable.jsx';
import CampaignEdit from './views/CampaignEdit.jsx';
import CampaignTable from './views/CampaignTable.jsx';
import CharacterCreate from './views/CharacterCreate.jsx';
import CharacterEdit from './views/CharacterEdit.jsx';
import CharactersTable from './views/CharactersTable.jsx';
import CharactersView from './views/CharactersView.jsx';
import EncounterTable from './views/EncounterTable.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import PartyEdit from './views/PartyEdit.jsx';
import PartyTable from './views/PartyTable.jsx';
import LanguageTable from './views/LanguagesTable.jsx';
import LoginDialog from './views/LoginDialog.jsx';
import MonsterEdit from './views/MonsterEdit.jsx';
import MonstersTable from './views/MonstersTable.jsx';
import NpcEdit from './views/NpcEdit.jsx';
import NpcTable from './views/NpcTable.jsx';
import SpellsTable from './views/SpellsTable.jsx';
import WeaponEdit from './views/WeaponEdit.jsx';
import WeaponsTable from './views/WeaponsTable.jsx';

import DefaultFilter from './views/DefaultFilter.jsx';
import Navigation from './views/Navigation.jsx';

class DndMachine extends React.Component
{
    render() {
        const auth = !!this.props.current_user;

        return <Router><div>
        <header className="nice-header fixed">
            <div className="nice-header-container">
                <h1 className="nice-header-brand">
                    <Link to={auth ? "/login" : "/"}>
                        <img
                            src="/static/img/dungeons-and-dragons-logo.png"
                            height="35"
                            />
                    </Link>
                </h1>
                <div className="nice-header-collapse">
                    {auth ? <DefaultFilter/> : null }
                    {auth ? <Navigation /> : null }
                </div>

                {auth ? <button
                        type="button"
                        className="nice-header-toggle collapsed"
                        onClick={UiActions.toggleMenu}
                        >
                    <span className="icon-bar top-bar"></span>
                    <span className="icon-bar middle-bar"></span>
                    <span className="icon-bar bottom-bar"></span>
                </button> : null }

            </div>
        </header>
        <section className="nice-fluid-container grid">
            <ErrorBoundary>{ auth ? <Switch>
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
                    path="/campaign/new"
                    component={CampaignEdit}
                    />
                <Route
                    path="/campaign/edit/:id"
                    component={CampaignEdit}
                    />
                <Route
                    path="/campaign/list"
                    component={CampaignTable}
                    />

                <Route
                    path="/character/list"
                    component={CharactersTable}
                    />
                <Route
                    path="/character/show/:id"
                    component={CharactersView}
                    />
                <Route
                    path="/character/edit/:id"
                    component={CharacterEdit}
                    />
                <Route
                    path="/character/new"
                    component={CharacterCreate}
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
                    path="/monster/edit/:id"
                    component={MonsterEdit}
                    />
                <Route
                    path="/monster/new"
                    component={MonsterEdit}
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
                    path="/npc/new"
                    component={NpcEdit}
                    />
                <Route
                    path="/npc/edit/:id"
                    component={NpcEdit}
                    />

                <Redirect path="/login" to="/character/list" />

                <Route path="*" render={props => {
                    window.location.href = props.location.pathname;
                    return '';
                }} />
            </Switch> : <Switch>

                <Route path="*" render={props => {
                    return <LoginDialog
                        message="Welcome to D&amp;D Machine. Please log in using your credentials to access this website."
                        icon="d20"
                        />;
                }} />

            </Switch> }</ErrorBoundary>
        </section>
    </div></Router>;
    }
}

const App = ListDataWrapper(DndMachine, ['current_user']);

ReactDom.render(
    <App />,
    document.getElementById('app')
);
