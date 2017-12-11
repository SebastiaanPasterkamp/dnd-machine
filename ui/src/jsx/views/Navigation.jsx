import React from 'react';
import {withRouter, Link} from 'react-router-dom';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';

import UiActions from '../actions/UiActions.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

class Navigation extends LazyComponent
{
    renderItem(item, location) {
        const classNames = ["highlight"];

        if (location.pathname == item.path) {
            classNames.push("primary");
        }

        return <li key={item.label} className={classNames.join(' ')}>
            <Link
                to={item.path}
                onClick={UiActions.toggleMenu}
                className={"icon fa-" + item.icon}>
                {item.label}
            </Link>
        </li>;
    }

    renderItemGroup(group, location) {
        const classNames = ["highlight"];

        group.items.map((item) => {
            if (location.pathname == item.path) {
                classNames.push("primary");
            }
        });

        return <li key={group.label} className={classNames.join(' ')}>
            <span className={"icon fa-" + group.icon}>
                {group.label}
            </span>
            <ul>
                {group.items.map((item) => {
                    return this.renderItem(item, location);
                })}
            </ul>
        </li>;
    }

    render() {
        const navigation = this.props.navigation || [];

        return <ul className="nice-header-menu menu-pills">
            {navigation.map((nav) => {
                return 'items' in nav
                    ? this.renderItemGroup(nav, this.props.location)
                    : this.renderItem(nav, this.props.location);
            })}
        </ul>;
    }
}

export default withRouter(ListDataWrapper(
    Navigation,
    ['navigation']
));
