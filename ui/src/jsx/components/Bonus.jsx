import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

import _ from 'lodash';

class Bonus extends LazyComponent
{
    render() {
        return <div className="bonus inline">
            {this.props.bonus > 0
                ? '+'
                : null
            }
            {!_.isUndefined(this.props.bonus)
                ? this.props.bonus
                : '—'
            }
        </div>;
    }
}

export default Bonus;