import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

import utils from '../../utils.jsx';


const BaseLinkButton = ({
    altStyle, icon, disabled, className,
    action, download, label, link, location,
}) => {
    const style = utils.makeStyle({
        'nice-btn-alt': altStyle,
        'nice-btn': !altStyle,
        'icon': icon,
        ['fa-' + icon]: icon,
        [className]: className && !disabled,
        'muted': disabled,
    }, ['cursor-pointer']);

    if (action) {
        return (
            <a
                onClick={action}
                className={style}
            >
                {label}
            </a>
        );
    }
    if (download) {
        return (
            <a
                href={download}
                className={style}
            >
                {label}
            </a>
        );
    }
    if (link) {
        if (location.pathname === link) {
            return null;
        }
        return (
            <Link
                to={link}
                className={style}
            >
                {label}
            </Link>
        );
    }
    return null;
};

BaseLinkButton.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.string,
    altStyle: PropTypes.bool,
    className: PropTypes.string,
    available: PropTypes.bool,
    disabled: PropTypes.bool,
    action: PropTypes.func,
    download: PropTypes.string,
    link: PropTypes.string,
};

BaseLinkButton.defaultProps = {
    label: null,
    icon: null,
    altStyle: false,
    className: null,
    available: true,
    disabled: false,
    action: null,
    download: null,
    link: null,
};

export default withRouter(BaseLinkButton);
