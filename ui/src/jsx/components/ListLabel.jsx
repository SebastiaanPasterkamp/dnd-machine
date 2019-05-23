import React from 'react';
import PropTypes from 'prop-types';
import {
    find,
} from 'lodash/fp';

import utils from '../utils.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import ToolTip from '../components/ToolTip.jsx';

class ListLabel extends LazyComponent
{
    render() {
        const {
            emptyLabel, className, items, value, short, tooltip
        } = this.props;
        if (value == null) {
            return null;
        }

        let label = emptyLabel || value;
        let description = null;

        let item = find({code: value}, items);
        if (item) {
            label = (short && 'short' in item)
                ? item.short
                : item.label;
            description = (tooltip && 'description' in item)
                ? item.description
                : null;
        }



        return (
            <div
                className={utils.makeStyle(
                    {},
                    ["list-label", "inline", className]
                )}
            >
                <ToolTip content={description}>
                    {label}
                </ToolTip>
            </div>
        );
    }
}

ListLabel.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    className: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    emptyLabel: PropTypes.string,
    short: PropTypes.bool,
    tooltip: PropTypes.bool,
};

export default ListLabel;
