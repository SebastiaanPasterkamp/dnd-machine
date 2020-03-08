import React from 'react';
import PropTypes from 'prop-types';

import { memoize } from '../../utils';

import ControlGroup from '../ControlGroup';
import FieldSet from '../FieldSet';
import InputField from '../InputField';
import MarkdownTextField from '../MarkdownTextField';
import ToggleSwitch from '../ToggleSwitch';

import { uuidv4 } from './utils';


export class ASIOption extends React.Component
{
    optionType = 'ability_score';

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
            name, description, limit,
        } = this.props;

        return (
            <FieldSet label="Ability Score Increase">
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

                <ControlGroup label="Limit">
                    <InputField
                        placeholder="Limit..."
                        value={limit}
                        type="number"
                        setState={this.onFieldChange('limit')}
                    />
                </ControlGroup>
            </FieldSet>
        );
    }
};

ASIOption.propTypes = {
    type: PropTypes.oneOf(['ability_score']),
    limit: PropTypes.number,
    setState: PropTypes.func.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
};

ASIOption.defaultProps = {
    type: 'ability_score',
    limit: 0,
    name: '',
    description: '',
};

export default ASIOption;
