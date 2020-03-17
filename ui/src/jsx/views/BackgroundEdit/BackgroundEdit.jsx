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
    DataConfig,
    uuidv4,
} from '../../components/DataConfig';

export class BackgroundEdit extends React.Component
{
    optionType = 'config';

    constructor(props) {
        super(props);
        const { uuid = uuidv4() } = props;
        this.state = { uuid };
        this.memoize = memoize.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    onFieldChange(field) {
        return this.memoize(field, value => {
            const { uuid: stateUUID } = this.state;
            const { setState, uuid = stateUUID } = this.props;
            setState({
                type: this.optionType,
                uuid,
                [field]: value,
            });
        });
    }

    render() {
        const { id, name, description, config } = this.props;

        return (
            <React.Fragment>
                <Panel
                    key="description"
                    className="background-edit__description"
                    header="Description"
                >
                    <ControlGroup label="Background">
                        <InputField
                            placeholder="Background..."
                            value={name}
                            setState={this.onFieldChange('name')}
                        />
                    </ControlGroup>

                    <ControlGroup label="Description">
                        <MarkdownTextField
                            placeholder="Description..."
                            value={description}
                            setState={this.onFieldChange('description')}
                        />
                    </ControlGroup>
                </Panel>

                <Panel
                    key="config"
                    className="background-edit__config"
                    header="Config"
                >
                    <DataConfig
                        list={config}
                        setState={this.onFieldChange('config')}
                    />
                </Panel>
            </React.Fragment>
        );
    }
}

BackgroundEdit.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    config: PropTypes.arrayOf(PropTypes.object),
};

BackgroundEdit.defaultProps = {
    id: null,
    name: '',
    description: '',
    config: [],
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
