import React from 'react';
import PropTypes from 'prop-types';

import { memoize } from '../../utils';

import ControlGroup from '../ControlGroup';
import FieldSet from '../FieldSet';
import InputField from '../InputField';
import MarkdownTextField from '../MarkdownTextField';
import ToggleSwitch from '../ToggleSwitch';

import { uuidv4 } from './utils';
import DataConfig from './DataConfig';

export class ConfigOption extends React.Component
{
    optionType = 'config';

    constructor(props) {
        super(props);
        const { uuid = uuidv4() } = props;
        this.state = { uuid };
        this.onFieldChange = this.onFieldChange.bind(this);
        this.memoize = memoize.bind(this);
    }

    onFieldChange(field) {
        return this.memoize(field, value => {
            const { uuid } = this.state;
            const { setState } = this.props;
            setState({
                type: this.optionType,
                uuid,
                [field]: value,
            });
        });
    }

    render() {
        const {
            name, description, config, canBeHidden, hidden,
        } = this.props;

        return (
            <FieldSet label="Config option">
                {canBeHidden ? (
                    <ToggleSwitch
                        checked={hidden}
                        onChange={this.onFieldChange('hidden')}
                        label="Hidden"
                    />
                ) : null}

                {!(canBeHidden && hidden) ? (
                    <ControlGroup label="Label">
                        <InputField
                            placeholder="Label..."
                            value={name}
                            type="text"
                            setState={this.onFieldChange('name')}
                        />
                    </ControlGroup>
                ) : null}

                {!(canBeHidden && hidden) ? (
                    <ControlGroup label="Description">
                        <MarkdownTextField
                            placeholder="Description..."
                            value={description}
                            className="small"
                            setState={this.onFieldChange('description')}
                        />
                    </ControlGroup>
                ) : null}

                <DataConfig
                    list={config}
                    setState={this.onFieldChange('config')}
                />
            </FieldSet>
        );
    }
};

ConfigOption.propTypes = {
    type: PropTypes.oneOf(['config']),
    config: PropTypes.arrayOf(PropTypes.object),
    setState: PropTypes.func.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    hidden: PropTypes.bool,
    canBeHidden: PropTypes.bool,
};

ConfigOption.defaultProps = {
    type: 'config',
    config: [],
    name: '',
    description: '',
    hidden: false,
    canBeHidden: true,
};

export default ConfigOption;
