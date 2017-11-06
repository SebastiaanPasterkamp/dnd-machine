import React from 'react';

import _ from 'lodash';

import LazyComponent from '../components/LazyComponent.jsx';

class Reach extends LazyComponent
{
    renderMinMax() {
        return <div
                className="reach inline">
            {this.props.min >= this.props.max
                ? this.props.min + " ft."
                : this.props.min + "/" + this.props.max + " ft."
            }
        </div>;
    }

    renderSimple() {
        return <div
                className="reach inline">
            {_.isNumber(this.props.distance)
                ? this.props.distance + " ft."
                : this.props.distance
            }
        </div>;
    }

    render() {
        return 'distance' in this.props
            ? this.renderSimple()
            : this.renderMinMax();
    }
}

export default Reach;