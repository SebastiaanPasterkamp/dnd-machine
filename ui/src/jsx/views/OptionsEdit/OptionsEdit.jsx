import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
    range,
} from 'lodash/fp';

import './sass/_options-edit.scss';

import { memoize } from '../../utils';

import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import ControlGroup from '../../components/ControlGroup';
import InputField from '../../components/InputField';
import MarkdownTextField from '../../components/MarkdownTextField';
import Panel from '../../components/Panel';
import { SelectListComponent } from '../../components/ListComponent';
import TabComponent from '../../components/TabComponent';

import {
    OPTIONS,
} from '../../components/DataConfig';

export class OptionsEdit extends React.Component
{
    optionType = 'multichoice';

    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.memoize = memoize.bind(this);
    }

    onFieldChange(field) {
        return this.memoize(field, value => {
            const { setState } = this.props;
            setState({
                type: this.optionsType,
                [field]: value,
            });
        });
    }

    render() {
        const { id, name, description, options } = this.props;

        return (
            <React.Fragment>
                <Panel
                    key="description"
                    className="options-edit__description"
                    header="Description"
                >
                    <ControlGroup label="Option">
                        <InputField
                            placeholder="Option..."
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
                    key="options"
                    className="options-edit__options"
                    header="Options"
                >
                    <SelectListComponent
                        list={options}
                        options={OPTIONS}
                        setState={this.onFieldChange('options')}
                    />
                </Panel>
            </React.Fragment>
        );
    }
}

OptionsEdit.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object),
    description: PropTypes.string,
};

OptionsEdit.defaultProps = {
    id: null,
    options: [],
    name: '',
    description: '',
};

export default RoutedObjectDataWrapper(
    OptionsEdit,
    {
        className: 'options-edit',
        icon: 'fa-user',
        label: 'Options',
        buttons: ['cancel', 'save']
    },
    "options",
    "data"
);
