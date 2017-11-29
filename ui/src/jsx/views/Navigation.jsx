import React from 'react';
import {Link} from 'react-router-dom';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

class Navigation extends LazyComponent
{
    renderItem(item) {
        return <li key={item.label} className="highlight">
            <Link
                to={item.path}
                className={"icon fa-" + item.icon}>
                {item.label}
            </Link>
        </li>;
    }

    renderItemGroup(group) {
        return <li key={group.label}>
            <span className={"icon fa-" + group.icon}>
                {group.label}
            </span>
            <ul>
                {group.items.map((item) => {
                    return this.renderItem(item);
                })}
            </ul>
        </li>;
    }

    render() {
        const navigation = this.props.navigation || [];

        return <ul className="nice-header-menu menu-pills">
            {navigation.map((nav) => {
                return 'items' in nav
                    ? this.renderItemGroup(nav)
                    : this.renderItem(nav);
            })}
        </ul>;
    }
}

export default ListDataWrapper(
    Navigation,
    ['navigation']
);
