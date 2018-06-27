"use strict";

import '../sass/base.scss';

import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';

import UiActions from './actions/UiActions.jsx';
import ListDataActions from './actions/ListDataActions.jsx';
import ListDataWrapper from './hocs/ListDataWrapper.jsx';

import AdventureLeagueLogEdit from './views/AdventureLeagueLogEdit.jsx';
import AdventureLeagueLogTable from './views/AdventureLeagueLogTable.jsx';
import AdventureLeagueLogView from './views/AdventureLeagueLogView.jsx';
import ArmorEdit from './views/ArmorEdit.jsx';
import ArmorTable from './views/ArmorTable.jsx';
import CampaignEdit from './views/CampaignEdit.jsx';
import CampaignTable from './views/CampaignTable.jsx';
import CharacterCreate from './views/CharacterCreate.jsx';
import CharacterEdit from './views/CharacterEdit.jsx';
import CharactersTable from './views/CharactersTable.jsx';
import CharactersView from './views/CharactersView.jsx';
import EncounterEdit from './views/EncounterEdit.jsx';
import EncounterTable from './views/EncounterTable.jsx';
import EncounterView from './views/EncounterView.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import PageFooter from './views/PageFooter.jsx';
import PartyEdit from './views/PartyEdit.jsx';
import PartyTable from './views/PartyTable.jsx';
import PartyView from './views/PartyView.jsx';
import LanguageTable from './views/LanguagesTable.jsx';
import LoadingSplash from './components/LoadingSplash.jsx';
import LoginDialog from './views/LoginDialog.jsx';
import MessageStack from './components/MessageStack.jsx';
import MonsterEdit from './views/MonsterEdit.jsx';
import MonstersTable from './views/MonstersTable.jsx';
import MonsterView from './views/MonsterView.jsx';
import NpcEdit from './views/NpcEdit.jsx';
import NpcTable from './views/NpcTable.jsx';
import NpcView from './views/NpcView.jsx';
import SpellEdit from './views/SpellEdit.jsx';
import SpellView from './views/SpellView.jsx';
import SpellsTable from './views/SpellsTable.jsx';
import UserEdit from './views/UserEdit.jsx';
import UsersTable from './views/UsersTable.jsx';
import UserView from './views/UserView.jsx';
import WeaponEdit from './views/WeaponEdit.jsx';
import WeaponsTable from './views/WeaponsTable.jsx';

import DefaultFilter from './views/DefaultFilter.jsx';
import Navigation from './views/Navigation.jsx';

class DndMachine extends React.Component
{
    render() {
        const { current_user } = this.props;
        const auth = !!current_user;
        const loading = current_user === undefined;

        return <Router><React.Fragment>
        <LoadingSplash
            loading={loading}
            overlay={true}
            />

        <header className="nice-header fixed">
            <div className="nice-header-container">
                <h1 className="nice-header-brand">
                    <Link to={auth ? "/character/list" : "/login"}>
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
                    path="/campaign/show/:id"
                    render={props => {
                        window.location.href = props.location.pathname;
                        return null;
                    }}
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
                    path="/log/adventureleague/list"
                    component={AdventureLeagueLogTable}
                    />
                <Route
                    path="/log/adventureleague/show/:id"
                    component={AdventureLeagueLogView}
                    />
                <Route
                    path="/log/adventureleague/edit/:id"
                    component={AdventureLeagueLogEdit}
                    />
                <Route
                    path="/log/adventureleague/new"
                    component={AdventureLeagueLogEdit}
                    />
                <Route
                    path="/log/adventureleague/new/:character_id"
                    component={AdventureLeagueLogEdit}
                    />

                <Route
                    path="/encounter/list"
                    component={EncounterTable}
                    />
                <Route
                    path="/encounter/show/:id"
                    component={EncounterView}
                    />
                <Route
                    path="/encounter/edit/:id"
                    component={EncounterEdit}
                    />
                <Route
                    path="/encounter/new"
                    component={EncounterEdit}
                    />

                <Route
                    path="/monster/list"
                    component={MonstersTable}
                    />
                <Route
                    path="/monster/show/:id"
                    component={MonsterView}
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
                    path="/party/show/:id"
                    component={PartyView}
                    />
                <Route
                    path="/party/edit/:id"
                    component={PartyEdit}
                    />
                <Route
                    path="/party/new"
                    component={PartyEdit}
                    />

                <Route
                    path="/items/languages/list"
                    component={LanguageTable}
                    />

                <Route
                    path="/items/spell/list"
                    component={SpellsTable}
                    />
                <Route
                    path="/items/spell/show/:id"
                    component={SpellView}
                    />
                <Route
                    path="/items/spell/new"
                    component={SpellEdit}
                    />
                <Route
                    path="/items/spell/edit/:id"
                    component={SpellEdit}
                    />

                <Route
                    path="/items/weapon/new"
                    component={WeaponEdit}
                    />
                <Route
                    path="/items/weapon/edit/:id"
                    component={WeaponEdit}
                    />
                <Route
                    path="/items/weapon/list"
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
                <Route
                    path="/npc/show/:id"
                    component={NpcView}
                    />

                <Route
                    path="/user/list"
                    component={UsersTable}
                    />
                <Route
                    path="/user/new"
                    component={UserEdit}
                    />
                <Route
                    path="/user/edit/:id"
                    component={UserEdit}
                    />
                <Route
                    path="/user/show/:id"
                    component={UserView}
                    />

                <Redirect
                    path="/login"
                    to="/character/list"
                    />

                <Route path="/logout" render={props => {
                    ListDataActions.doLogout(
                        () => props.history.push('/login')
                    );

                    return null;
                }} />

                <Route path="*" render={props => {
                    return "Whoops";
                }} />
            </Switch> : <Switch>

                <Route path="*" render={props => (
                    <LoginDialog
                        message="Welcome to D&amp;D Machine. Please log in using your credentials to access this website."
                        icon="d20"
                        />
                )} />

            </Switch> }</ErrorBoundary>
        </section>
        <PageFooter />
        <MessageStack
            messages={[
                {id: 'abc', message: 'test', title: 'foo'}
                ]}
            />
    </React.Fragment></Router>;
    }
}

const App = ListDataWrapper(DndMachine, ['current_user']);

ReactDom.render(
    <App />,
    document.getElementById('app')
);
