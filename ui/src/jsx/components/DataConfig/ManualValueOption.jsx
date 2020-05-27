import React from 'react';
import PropTypes from 'prop-types';

import { memoize } from '../../utils';

import ControlGroup from '../ControlGroup';
import FieldSet from '../FieldSet';
import InputField from '../InputField';
import { ListComponent } from '../ListComponent';

import { uuidv4 } from './utils';


export class ManualValueOption extends React.Component
{
    optionType = 'manual';

    constructor(props) {
        super(props);
        const { uuid = uuidv4() } = props;
        this.state = { uuid };
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onSuggestionsChange = this.onSuggestionsChange.bind(this);
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

    onSuggestionsChange(suggestions) {
        const { uuid } = this.state;
        const { setState } = this.props;
        setState({
            type: this.optionType,
            uuid,
            suggestions,
        });
    }

    render() {
        const {
            name, path, suggestions,
        } = this.props;

        return (
            <FieldSet label="Manual Value option">
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

                <ControlGroup label="Suggestions">
                    <ListComponent
                        list={suggestions}
                        component={InputField}
                        componentProps={{type: "text"}}
                        newItem="auto"
                        setState={this.onSuggestionsChange}
                    />
                </ControlGroup>
            </FieldSet>
        );
    }
};

ManualValueOption.propTypes = {
    type: PropTypes.oneOf(['manual']),
    path: PropTypes.string,
    suggestions: PropTypes.arrayOf(PropTypes.string),
    setState: PropTypes.func.isRequired,
    name: PropTypes.string,
};

ManualValueOption.defaultProps = {
    type: 'manual',
    name: '',
    suggestions: [],
};

export default ManualValueOption;
