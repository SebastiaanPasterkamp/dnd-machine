import React from 'react';
import PropTypes from 'prop-types';

import { memoize } from '../../utils';

import ControlGroup from '../ControlGroup';
import FieldSet from '../FieldSet';
import InputField from '../InputField';
import MarkdownTextField from '../MarkdownTextField';

import { uuidv4 } from './utils';
import DataConfig from './DataConfig';

export class PermanentOption extends React.Component
{
    optionType = 'permanent';

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
        const { name, description, config } = this.props;

        return (
            <FieldSet label="Permanent config option">
                <ControlGroup label="Label">
                    <InputField
                        placeholder="Label..."
                        value={name}
                        type="text"
                        setState={this.onFieldChange('name')}
                    />
                </ControlGroup>

                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={description}
                        className="small"
                        setState={this.onFieldChange('description')}
                    />
                </ControlGroup>

                <DataConfig
                    list={config}
                    setState={this.onFieldChange('config')}
                />
            </FieldSet>
        );
    }
};

PermanentOption.propTypes = {
    type: PropTypes.oneOf(['permanent']),
    config: PropTypes.arrayOf(PropTypes.object),
    setState: PropTypes.func.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
};

PermanentOption.defaultProps = {
    type: 'permanent',
    config: [],
    name: '',
    description: '',
};

export default PermanentOption;
