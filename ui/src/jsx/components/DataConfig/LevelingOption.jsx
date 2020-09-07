import React from 'react';
import PropTypes from 'prop-types';

import { memoize } from '../../utils';

import ControlGroup from '../ControlGroup';
import FieldSet from '../FieldSet';
import InputField from '../InputField';
import MarkdownTextField from '../MarkdownTextField';

import { uuidv4 } from './utils';
import DataConfig from './DataConfig';

export class LevelingOption extends React.Component
{
    optionType = 'leveling';

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
        const { name, description, path, given } = this.props;

        return (
            <FieldSet label="Leveling config option">
                <ControlGroup label="Path">
                    <InputField
                        placeholder="Path..."
                        value={path}
                        type="text"
                        setState={this.onFieldChange('path')}
                    />
                </ControlGroup>

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
                    list={given}
                    setState={this.onFieldChange('given')}
                />
            </FieldSet>
        );
    }
};

LevelingOption.propTypes = {
    type: PropTypes.oneOf(['leveling']),
    path: PropTypes.string.isRequired,
    given: PropTypes.arrayOf(PropTypes.object),
    setState: PropTypes.func.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
};

LevelingOption.defaultProps = {
    type: 'leveling',
    path: 'sub..leveling',
    given: [],
    name: '',
    description: '',
};

export default LevelingOption;
