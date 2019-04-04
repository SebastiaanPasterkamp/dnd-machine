import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

import _ from 'lodash';

class Progress extends LazyComponent
{
    getClosest(value, options) {
        let best = Math.abs(value - options[0].value);

        return _.reduce(
            options,
            (closest, option) => {
                let delta = Math.abs(value - option.value);
                if (delta < best) {
                    best = delta;
                    return option.label;
                }
                return closest;
            },
            options[0].label
        );
    }

    render() {
        let ratio = this.props.total
                ? this.props.value / this.props.total
                : 1.0,
            style = ["nice-progress"],
            label = (ratio * 100.0) + '%';

        if ('label' in this.props) {
            label = this.props.label;
        }

        if ('labels' in this.props) {
            label = this.getClosest(ratio, this.props.labels);
        }

        if ('color' in this.props) {
            style.push(this.props.color);
        }

        if ('colors' in this.props) {
            style.push(this.getClosest(ratio, this.props.colors));
        }

        return <div className={style.join(' ')}>
            <div
                className="nice-progress-fill"
                style={{
                    width: (ratio * 100.0) + '%',
                    height: '1.25rem'
                }}>
                {label}
            </div>
        </div>;
    }
}

export default Progress;