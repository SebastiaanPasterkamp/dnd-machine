import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import LazyComponent from '../components/LazyComponent.jsx';
import ToolTip from '../components/ToolTip.jsx';

class ListLabel extends LazyComponent
{
    render() {
        const {
            emptyLabel, items, value, short, tooltip
        } = this.props;
        if (value == null) {
            return null;
        }

        let label = emptyLabel || value;
        let description = null;

        let item = _.find(items, {code: value});
        if (item) {
            label = (short && 'short' in item)
                ? item.short
                : item.label;
            description = (tooltip && 'description' in item)
                ? item.description
                : null;
        }

        return <div className="list-label inline">
            <ToolTip content={description}>
            {label}
            </ToolTip>
        </div>;
    }
}

ListLabel.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    emptyLabel: PropTypes.string,
    short: PropTypes.bool,
    tooltip: PropTypes.bool,
};

export default ListLabel;