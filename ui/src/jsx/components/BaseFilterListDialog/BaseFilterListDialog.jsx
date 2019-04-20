import React from 'react';
import PropTypes from 'prop-types';
import {
    filter,
    map,
} from 'lodash/fp';

import ModalDialog from '../ModalDialog.jsx';
import utils from '../../utils.jsx';

import './sass/_base-filter-list-dialog.scss';


const BaseFilterListDialog = function({
    items,
    rowComponent: RowComponent,
    label,
    className,
    onCancel,
    onDone,
    onFilter,
    children,
    ...props
}) {
    const style = utils.makeStyle({}, [
        'base-filter-list-dialog',
        className,
    ]);

    const filtered = onFilter
        ? filter(onFilter)(items)
        : items;

    return (
        <ModalDialog
            label={label}
            className={style}
            onCancel={onCancel}
            onDone={onDone}
            subheading={children}
        >
            {map(item => (
                <RowComponent
                    key={item.id}
                    item={item}
                    {...props}
                />
            ))(filtered)}
        </ModalDialog>
    );
};

BaseFilterListDialog.propTypes = {
    items: PropTypes.objectOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
        })
    ).isRequired,
    label: PropTypes.string.isRequired,
    rowComponent: PropTypes.any.isRequired,
    className: PropTypes.string,
    onCancel: PropTypes.func,
    onDone: PropTypes.func,
    onFilter: PropTypes.func,
};

BaseFilterListDialog.defaultProps = {
    className: null,
    onDone: null,
    onFilter: null,
};

export default BaseFilterListDialog;
