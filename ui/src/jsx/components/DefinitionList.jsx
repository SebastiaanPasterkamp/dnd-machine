import React from 'react';
import _ from 'lodash';

import '../../sass/_list-component.scss';

import LazyComponent from './LazyComponent.jsx';
import InputField from './InputField.jsx';
import ListComponent from './ListComponent.jsx';
import MarkdownTextField from './MarkdownTextField.jsx';

export class Definition extends LazyComponent
{
    onFieldChange(field, value, callback=null) {
        this.props.setState({
            [field]: value
        }, callback);
    }

    render() {
        const {
            name, description = ''
        } = this.props;

        return <div>
            <InputField
                placeholder="Name..."
                value={name}
                setState={(value) => {
                    this.onFieldChange('name', value);
                }}
                />
            <MarkdownTextField
                placeholder="Description..."
                value={description}
                rows={5}
                setState={(value) => {
                    this.onFieldChange('description', value);
                }} />
        </div>
    }
}

export class DefinitionList extends LazyComponent
{
    render() {
        const {
            list, setState
        } = this.props;

        return <ListComponent
            list={_.map(list, (description, name) => ({
                name, description
            }))}
            component={Definition}
            initialItem={{name: '', description: ''}}
            keyProp="name"
            setState={(value, callback=null) => {
                setState(_.reduce(
                    value,
                    (list, {name, description}) => {
                        list[name] = description;
                        return list;
                    },
                    {}
                ), callback
            )}}
            />
    }
}

DefinitionList.defaultProps = {
    setState: (value) => {
        console.log(['DefinitionList', value]);
    }
};

export default DefinitionList;
