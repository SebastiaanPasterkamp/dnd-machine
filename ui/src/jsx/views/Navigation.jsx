import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';

import utils from '../utils.jsx';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';

import UiActions from '../actions/UiActions.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

class Navigation extends LazyComponent
{
    renderItem(item, location) {
        const style = utils.makeStyle({
            primary: _.startsWith(location.pathname, item.path)
        }, ["highlight"]);

        return <li key={item.label} className={style}>
            <Link
                to={item.path}
                onClick={UiActions.toggleMenu}
                className={"icon fa-" + item.icon}>
                {item.label}
            </Link>
        </li>;
    }

    renderItemGroup(group, location) {
        const style = utils.makeStyle({
            primary: _.some(
                group.items,
                item => _.startsWith(location.pathname, item.path)
            ),
        }, ["highlight"]);

        return <li key={group.label} className={style}>
            <span className={"icon fa-" + group.icon}>
                {group.label}
            </span>
            <ul>
                {_.map(group.items, item => (
                    this.renderItem(item, location)
                ))}
            </ul>
        </li>;
    }

    render() {
        const {
            navigation = [], location
        } = this.props;

        return <ul className="nice-header-menu menu-pills">
            {_.map(navigation, nav => (
                'items' in nav
                    ? this.renderItemGroup(nav, location)
                    : this.renderItem(nav, location)
            ))}
        </ul>;
    }
}

export default withRouter(ListDataWrapper(
    Navigation,
    ['navigation']
));
