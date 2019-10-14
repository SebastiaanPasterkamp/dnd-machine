import React from 'react';
import PropTypes from 'prop-types';

import { memoize } from '../../../utils';

import ControlGroup from '../../../components/ControlGroup';
import InputField from '../../../components/InputField';
import Panel from '../../../components/Panel';
import MarkdownTextField from '../../../components/MarkdownTextField';

export class DescriptionPanel extends React.Component
{
    constructor(props) {
        super(props);
        this.memoize = memoize.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    onFieldChange(field) {
        const { setState } = this.props;
        return this.memoize(
            field,
            (value) => setState({ [field]: value })
        );
    }

    render() {
        const { name, description } = this.props;

        return (
            <Panel
                key="description"
                className="encounter-edit__description"
                header="Description"
            >
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={name}
                        setState={this.onFieldChange('name')}
                    />
                </ControlGroup>
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={description}
                        rows={5}
                        setState={this.onFieldChange('description')}
                    />
                </ControlGroup>
            </Panel>
        );
    }
}

DescriptionPanel.propTypes = {
    setState: PropTypes.func.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
};

DescriptionPanel.defaultProps = {
    name: '',
    description: '',
};

export default DescriptionPanel;
