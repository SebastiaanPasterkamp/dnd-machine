import React from 'react';
import PropTypes from 'prop-types';
import {
    find,
} from 'lodash/fp';

import utils from '../utils';

import LazyComponent from '../components/LazyComponent';
import ToolTip from '../components/ToolTip';

class ListLabel extends LazyComponent
{
    render() {
        const {
            emptyLabel, className, items, value, short, tooltip
        } = this.props;
        if (value == null) {
            return null;
        }
        const item = find({ id: value }, items);

        let name = emptyLabel || value;
        let description = null;

        if (item) {
            name = (short && 'short' in item)
                ? item.short
                : item.name;
            description = tooltip ? item.description || null : null;
        }

        return (
            <div
                className={utils.makeStyle(
                    {},
                    ["list-label", "inline", className]
                )}
            >
                <ToolTip content={description}>
                    { name }
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
