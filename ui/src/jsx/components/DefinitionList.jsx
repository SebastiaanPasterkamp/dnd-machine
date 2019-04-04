import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_list-component.scss';

import LazyComponent from './LazyComponent.jsx';
import InputField from './InputField.jsx';
import ListComponent from './ListComponent.jsx';
import MarkdownTextField from './MarkdownTextField.jsx';

export class Definition extends LazyComponent
{
    render() {
        const {
            name, description = '',
            setState,
        } = this.props;

        return <div>
            <InputField
                placeholder="Name..."
                value={ name }
                setState={ name => setState({ name }) }
                />
            <MarkdownTextField
                placeholder="Description..."
                value={ description }
                rows={5}
                setState={ description => setState({ description }) }
                />
        </div>
    }
}

Definition.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    setState: PropTypes.func.isRequired,
};

export class DefinitionList extends LazyComponent
{
    onSetState(value, callback) {
        const {
            list, setState,
        } = this.props;

        if (!setState) {
            return;
        }

        setState(
            _.fromPairs(
                _.map(
                    value,
                    ({name, description}) => ([name, description])
                )
            ),
            callback
        );
    }

    render() {
        const {
            list, setState, ...props
        } = this.props;

        return <ListComponent
            newItem="auto"
            {...props}
            list={ _.map(
                list,
                (description, name) => ({ name, description })
            ) }
            component={ Definition }
            initialItem={{ name: '', description: '' }}
            keyProp="name"
            setState={
                (value, callback=null) => this.onSetState(
                    value, callback
                )
            }
            />
    }
}

DefinitionList.defaultProps = {
    setState: (value) => {
        console.log(['DefinitionList', value]);
    }
};

DefinitionList.propTypes = {
    list: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
};

export default DefinitionList;
