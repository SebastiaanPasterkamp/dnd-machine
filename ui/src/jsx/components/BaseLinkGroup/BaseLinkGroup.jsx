import React from 'react';
import PropTypes from 'prop-types';

import utils from '../../utils.jsx';

import './sass/_base-link-group.scss';


class BaseLinkGroup extends React.Component
{
    render() {
        const {
            className, include, exclude, children,
        } = this.props;

        const style = utils.makeStyle({
            [className]: className,
        }, ['base-link-group', 'nice-btn-group']);

        const filtered = React.Children.map(children, child => {
            if (!child) {
                return null;
            }
            const { available = true, name } = child.props;
            if (name === undefined) {
                return child;
            }
            if (!available) {
                return null;
            }
            if (include !== null && !include.includes(name)) {
                return null;
            }
            if (exclude !== null && exclude.includes(name)) {
                return null;
            }
            return child;
        });

        if (!filtered.length) {
            return null;
        }

        return (
            <div className={style}>
                {filtered}
            </div>
        );
    }
};

BaseLinkGroup.propTypes = {
    include: PropTypes.arrayOf(
        PropTypes.string
    ),
    exclude: PropTypes.arrayOf(
        PropTypes.string
    ),
    className: PropTypes.string,
};

BaseLinkGroup.defaultProps = {
    include: null,
    exclude: null,
    children: [],
};

export default BaseLinkGroup;
