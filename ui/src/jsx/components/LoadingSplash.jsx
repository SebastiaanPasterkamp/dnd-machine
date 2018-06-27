import React from 'react';
import PropTypes from 'prop-types';

import '../../sass/_loading-splash.scss';

import LazyComponent from './LazyComponent.jsx';

export class LoadingSplash extends LazyComponent
{
    render() {
        const {
            loading = false,
            overlay = false,
        } = this.props;

        if (!loading) {
            return null;
        }

        if (overlay) {
            return <div className="loading-splash-overlay">
                <div className="loading-splash" />
            </div>;
        }

        return <div className="loading-splash" />
    }
}

LoadingSplash.propTypes = {
    loading: PropTypes.bool,
    overlay: PropTypes.bool,
};

export default LoadingSplash;
