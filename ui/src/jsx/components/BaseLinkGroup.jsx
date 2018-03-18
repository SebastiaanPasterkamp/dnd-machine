import React from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash';

import '../../sass/_base-link-group.scss';

import utils from '../utils.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

class BaseLinkGroup extends LazyComponent
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        return {};
    }

    getAllowed() {
        return [];
    }

    renderButton(button, props) {
        const {
            altStyle, icon, className, action, download, label, link
        } = _.assign({}, this.props, props);
        const style = utils.makeStyle({
            'nice-btn-alt': altStyle,
            'nice-btn': !altStyle,
            'icon': icon,
            ['fa-' + icon]: icon,
            [className]: className,
        }, ['cursor-pointer']);

        if (action) {
            return <a
                key={button}
                onClick={action}
                className={style}
                >
                {label}
            </a>;
        }
        if (download) {
            return <a
                key={button}
                href={download}
                className={style}
                >
                {label}
            </a>;
        }
        return <Link
            key={button}
            to={link}
            className={style}
            >
            {label}
        </Link>;
    }

    render() {
        const {
            buttons, className, extra
        } = this.props;
        const style = utils.makeStyle({
            [className]: className,
        }, ['base-link-group', 'nice-btn-group']);
        const allowed = this.getAllowed();

        const filtered = _.reduce(
            this.buttonList(),
            (filtered, func, button) => {
                const props = func();
                if (!_.includes(buttons, button)) {
                    return filtered;
                }
                if ('available' in props && !props.available) {
                    return filtered;
                }
                if (
                    !('available' in props)
                    && !_.includes(allowed, button)
                ) {
                    return filtered;
                }
                filtered.push(props);
                return filtered;
            },
            []
        );

        return <div className={style}>
            {_.map(
                filtered,
                (props, button) => this.renderButton(button, props)
            )}
            {_.map(
                extra,
                (props, button) => this.renderButton(button, props)
            )}
        </div>;
    }
}

BaseLinkGroup.defaultProps = {
    altStyle: false,
    extra: [],
};

export default BaseLinkGroup;
