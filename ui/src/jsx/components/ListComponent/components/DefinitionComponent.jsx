import React from 'react';
import PropTypes from 'prop-types';

import InputField from '../../InputField';
import MarkdownTextField from '../../MarkdownTextField';

export class DefinitionComponent extends React.Component
{
    constructor(props) {
        super(props);
        this.onNameChange = this.onNameChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
    }

    onNameChange(name) {
        const { setState } = this.props;
        setState({ name });
    }

    onDescriptionChange(description) {
        const { setState } = this.props;
        setState({ description });
    }

    render() {
        const {
            name, description = '',
            setState,
        } = this.props;

        return (
            <div>
                <InputField
                    placeholder="Name..."
                    value={ name }
                    setState={this.onNameChange}
                />
                <MarkdownTextField
                    placeholder="Description..."
                    value={description}
                    rows={5}
                    setState={this.onDescriptionChange}
                />
            </div>
        );
    }
}

DefinitionComponent.propTypes = {
    name: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    description: PropTypes.string,
};

DefinitionComponent.defaultProps = {
    name: '',
    description: '',
};

export default DefinitionComponent;
