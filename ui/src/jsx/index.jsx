"use strict";
import "core-js/modules/es6.promise";
import "core-js/modules/es6.array.iterator";

import '../sass/base.scss';

import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';
import Loadable from 'react-loadable';

import ActivityWrapper from './hocs/ActivityWrapper.jsx';
import UiActions from './actions/UiActions.jsx';
import ListDataActions from './actions/ListDataActions.jsx';
import ListDataWrapper from './hocs/ListDataWrapper.jsx';

import LoadingSplash from './components/LoadingSplash.jsx';

const AdventureLeagueLogEdit = Loadable({
      loader: () => import(
          /* webpackChunkName: 'AdventureLeagueLogEdit' */
          './views/AdventureLeagueLogEdit'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});

import AdventureLeagueLogTable from './views/AdventureLeagueLogTable.jsx';
import AdventureLeagueLogView from './views/AdventureLeagueLogView.jsx';
const ArmorEdit = Loadable({
      loader: () => import(
          /* webpackChunkName: 'ArmorEdit' */
          './views/ArmorEdit'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
import ArmorTable from './views/ArmorTable.jsx';
const CampaignEdit = Loadable({
      loader: () => import(
          /* webpackChunkName: 'CampaignEdit' */
          './views/CampaignEdit'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
import CampaignTable from './views/CampaignTable.jsx';
import CharacterCreate from './views/CharacterCreate.jsx';
const CharacterEdit = Loadable({
      loader: () => import(
          /* webpackChunkName: 'CharacterEdit' */
          './views/CharacterEdit'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
import CharactersTable from './views/CharactersTable.jsx';
import CharacterView from './views/CharacterView';
const EncounterEdit = Loadable({
      loader: () => import(
          /* webpackChunkName: 'EncounterEdit' */
          './views/EncounterEdit'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
const EncountersTable = Loadable({
      loader: () => import(
          /* webpackChunkName: 'EncountersTable' */
          './views/EncountersTable'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
import EncounterView from './views/EncounterView.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import PageFooter from './views/PageFooter.jsx';
const PartyEdit = Loadable({
      loader: () => import(
          /* webpackChunkName: 'PartyEdit' */
          './views/PartyEdit'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
import PartyTable from './views/PartyTable.jsx';
import PartyView from './views/PartyView.jsx';
import LanguageTable from './views/LanguagesTable.jsx';
import LoginDialog from './views/LoginDialog.jsx';
import MessageStack from './components/MessageStack.jsx';
const MonsterEdit = Loadable({
      loader: () => import(
          /* webpackChunkName: 'MonsterEdit' */
          './views/MonsterEdit'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
const MonstersTable = Loadable({
      loader: () => import(
          /* webpackChunkName: 'MonstersTable' */
          './views/MonstersTable'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
import MonsterView from './views/MonsterView.jsx';
const NpcEdit = Loadable({
      loader: () => import(
          /* webpackChunkName: 'NpcEdit' */
          './views/NpcEdit'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
const NpcsTable = Loadable({
      loader: () => import(
          /* webpackChunkName: 'NpcsTable' */
          './views/NpcsTable'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
import NpcView from './views/NpcView.jsx';
const SpellEdit = Loadable({
      loader: () => import(
          /* webpackChunkName: 'SpellEdit' */
          './views/SpellEdit'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
import SpellView from './views/SpellView.jsx';
import SpellsTable from './views/SpellsTable.jsx';
const UserEdit = Loadable({
      loader: () => import(
          /* webpackChunkName: 'UserEdit' */
          './views/UserEdit'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
import UsersTable from './views/UsersTable.jsx';
import UserView from './views/UserView.jsx';
const WeaponEdit = Loadable({
      loader: () => import(
          /* webpackChunkName: 'WeaponEdit' */
          './views/WeaponEdit'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
import WeaponView from './views/WeaponView.jsx';
import WeaponsTable from './views/WeaponsTable.jsx';

const ClassEdit = Loadable({
      loader: () => import(
          /* webpackChunkName: 'ClassEdit' */
          './views/ClassEdit'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
const SubClassEdit = Loadable({
      loader: () => import(
          /* webpackChunkName: 'SubClassEdit' */
          './views/SubClassEdit'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
const RaceEdit = Loadable({
      loader: () => import(
          /* webpackChunkName: 'RaceEdit' */
          './views/RaceEdit'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});

const OptionsTable = Loadable({
      loader: () => import(
          /* webpackChunkName: 'OptionsTable' */
          './views/OptionsTable'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});
const OptionsEdit = Loadable({
      loader: () => import(
          /* webpackChunkName: 'OptionsEdit' */
          './views/OptionsEdit'
      ),
      loading: () => <LoadingSplash loading={true} overlay={true} />,
});

import DefaultFilter from './views/DefaultFilter.jsx';
import Navigation from './views/Navigation.jsx';

const ActivityLoadingSplash = ActivityWrapper(LoadingSplash);

class DndMachine extends React.Component
{
    render() {
        const { current_user } = this.props;
        const auth = !!current_user;
        const loading = current_user === undefined;

        return <Router><React.Fragment>
        <ActivityLoadingSplash
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
                    component={CharacterView}
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
                    path="/character/reset/:id"
                    component={CharacterCreate}
                    />

                <Route
                    path="/log/adventureleague/list/:character_id"
                    component={AdventureLeagueLogTable}
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
                    path="/log/adventureleague/edit/:id/:character_id"
                    component={AdventureLeagueLogEdit}
                />
                <Route
                    path="/log/adventureleague/edit/:id"
                    component={AdventureLeagueLogEdit}
                />
                <Route
                    path="/log/adventureleague/new/:character_id"
                    component={AdventureLeagueLogEdit}
                />
                <Route
                    path="/log/adventureleague/new"
                    component={AdventureLeagueLogEdit}
                />

                <Route
                    path="/encounter/list"
                    component={EncountersTable}
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
                    path="/items/weapon/show/:id"
                    component={WeaponView}
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
                    component={NpcsTable}
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

                <Route
                    path="/data/class/new"
                    component={ClassEdit}
                />
                <Route
                    path="/data/class/edit/:id"
                    component={ClassEdit}
                />

                <Route
                    path="/data/subclass/new"
                    component={SubClassEdit}
                />
                <Route
                    path="/data/subclass/edit/:id"
                    component={SubClassEdit}
                />

                <Route
                    path="/data/race/new"
                    component={RaceEdit}
                />
                <Route
                    path="/data/race/edit/:id"
                    component={RaceEdit}
                />

                <Route
                    path="/data/options/list"
                    component={OptionsTable}
                />
                <Route
                    path="/data/options/new"
                    component={OptionsEdit}
                />
                <Route
                    path="/data/options/edit/:id"
                    component={OptionsEdit}
                />

                <Redirect
                    path="/login"
                    to="/character/list"
                    />

                <Route path="/logout" render={props => {
                    ListDataActions.doLogout(
                        () => window.location = '/login'
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
                        onLogin={() => props.history.push('/character/list')}
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

if (module.hot) {
    module.hot.accept();
}
