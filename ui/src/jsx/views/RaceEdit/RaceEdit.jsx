import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
    range,
} from 'lodash/fp';

import './sass/_race-edit.scss';

import { memoize } from '../../utils';

import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import ControlGroup from '../../components/ControlGroup';
import InputField from '../../components/InputField';
import MarkdownTextField from '../../components/MarkdownTextField';
import Panel from '../../components/Panel';
import { SelectListComponent } from '../../components/ListComponent';

import {
    OPTIONS,
} from '../../components/DataConfig';

export class RaceEdit extends React.Component
{
    optionType = 'config';

    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.memoize = memoize.bind(this);
    }

    onFieldChange(field) {
        return this.memoize(field, value => {
            const { setState } = this.props;
            setState({
                type: this.optionType,
                [field]: value,
            });
        });
    }

    render() {
        const { id, name, config, description } = this.props;

        return (
            <React.Fragment>
                <Panel
                    key="description"
                    className="race-edit__description"
                    header="Description"
                >
                    <ControlGroup label="Race">
                        <InputField
                            placeholder="Race..."
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
                    className="race-edit__config"
                    header="Config"
                >
                    <SelectListComponent
                        list={config}
                        options={OPTIONS}
                        setState={this.onFieldChange('config')}
                    />
                </Panel>
            </React.Fragment>
        );
    }
}

RaceEdit.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    config: PropTypes.arrayOf(PropTypes.object),
    description: PropTypes.string,
};

RaceEdit.defaultProps = {
    id: null,
    config: [],
    name: '',
    description: '',
};

export default RoutedObjectDataWrapper(
    RaceEdit,
    {
        className: 'race-edit',
        icon: 'fa-cube',
        label: 'Class',
        buttons: ['cancel', 'save']
    },
    "race",
    "data"
);
