import React from 'react';
import PropTypes from 'prop-types';

import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import { BaseEditView } from '../../components/DataConfig';

const RaceEdit = function(props) {
    return (
        <BaseEditView
            baseClass="race-edit"
            {...props}
        />
    );
};

RaceEdit.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    config: PropTypes.arrayOf(PropTypes.object),
    phases: PropTypes.arrayOf(PropTypes.object),
};

RaceEdit.defaultProps = {
    id: null,
    name: '',
    description: '',
    config: [],
    phases: [],
};

export default RoutedObjectDataWrapper(
    RaceEdit,
    {
        className: 'race-edit',
        icon: 'fa-cube',
        label: 'Race',
        buttons: ['cancel', 'save']
    },
    "race",
    "data"
);
