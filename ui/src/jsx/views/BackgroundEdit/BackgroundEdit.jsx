import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
    range,
} from 'lodash/fp';

import './sass/_background-edit.scss';

import { memoize } from '../../utils';

import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import ControlGroup from '../../components/ControlGroup';
import InputField from '../../components/InputField';
import MarkdownTextField from '../../components/MarkdownTextField';
import Panel from '../../components/Panel';
import TabComponent from '../../components/TabComponent';

import {
    BaseEditView,
    DataConfig,
    uuidv4,
} from '../../components/DataConfig';

const BackgroundEdit = function(props) {
    return (
        <BaseEditView
            baseClass="background-edit"
            {...props}
        />
    );
};

BackgroundEdit.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    config: PropTypes.arrayOf(PropTypes.object),
    phases: PropTypes.arrayOf(PropTypes.object),
};

BackgroundEdit.defaultProps = {
    id: null,
    name: '',
    description: '',
    config: [],
    phases: [],
};

export default RoutedObjectDataWrapper(
    BackgroundEdit,
    {
        className: 'background-edit',
        icon: 'fa-history',
        label: 'Background',
        buttons: ['cancel', 'save']
    },
    "background",
    "data"
);
