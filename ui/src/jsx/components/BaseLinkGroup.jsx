import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import '../../sass/_base-link-group.scss';

import utils from '../utils.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

class BaseLinkButton extends LazyComponent
{
    constructor(props) {
        super(props);
    }

    render() {
        const {
            altStyle, icon, className, action, download, label, link,
        } = this.props;

        const style = utils.makeStyle({
            'nice-btn-alt': altStyle,
            'nice-btn': !altStyle,
            'icon': icon,
            ['fa-' + icon]: icon,
            [className]: className,
        }, ['cursor-pointer']);

        if (action) {
            return <a
                onClick={action}
                className={style}
                >
                {label}
            </a>;
        }
        if (download) {
            return <a
                href={download}
                className={style}
                >
                {label}
            </a>;
        }
        if (link) {
            return <Link
                to={link}
                className={style}
                >
                {label}
            </Link>;
        }
        return null;
    }
};

BaseLinkButton.propTypes = {
    altStyle: PropTypes.bool,
    icon: PropTypes.string,
    className: PropTypes.string,
    action: PropTypes.func,
    download: PropTypes.string,
    label: PropTypes.string,
    link: PropTypes.string,
};

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

    render() {
        const {
            buttons, className, altStyle, extra = [],
        } = this.props;
        const style = utils.makeStyle({
            [className]: className,
        }, ['base-link-group', 'nice-btn-group']);
        const allowed = this.getAllowed();

        const filtered = _(
                this.buttonList()
            ).pickBy(
                (func, action) => (
                    !buttons || _.includes(buttons, action)
                )
            ).mapValues(
                func => func()
            ).pickBy(
                (props, action) => 'available' in props
                    ? props.available
                    : _.includes(allowed, action)
            ).value();

        return <div className={style}>
            {_.map(
                filtered,
                (props, button) => (
                    <BaseLinkButton
                        key={ button }
                        altStyle={ altStyle }
                        className={ className }
                        {...props}
                        />
                )
            )}
            {_.map(
                extra,
                (props, button) => (
                    <BaseLinkButton
                        key={ button }
                        altStyle={ altStyle }
                        className={ className }
                        {...props}
                        />
                )
            )}
        </div>;
    }
}

BaseLinkGroup.propTypes = {
    buttons: PropTypes.arrayOf(
        PropTypes.string
    ),
    className: PropTypes.string,
    extra: PropTypes.arrayOf(
        PropTypes.shape({
            altStyle: PropTypes.bool,
            icon: PropTypes.string,
            className: PropTypes.string,
            action: PropTypes.func,
            download: PropTypes.string,
            label: PropTypes.string,
            link: PropTypes.string,
        })
    ),
    altStyle: PropTypes.bool,
};

export default BaseLinkGroup;
