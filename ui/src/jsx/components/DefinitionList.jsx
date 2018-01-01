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
        return <div>
            <InputField
                placeholder="Name..."
                value={this.props.name || ''}
                setState={(value) => {
                    this.onFieldChange('name', name);
                }}
                />
            <MarkdownTextField
                placeholder="Description..."
                value={this.props.description || ''}
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
        return <ListComponent
            list={_.values(this.props.list)}
            component={Definition}
            keyProp="name"
            setState={(value, callback=null) => {
                this.props.setState(
                    _.reduce(value, (list, val) => {
                        list[val.name] = val;
                        return list;
                    }, {}),
                    callback
                );
            }}
            />
    }
}

DefinitionList.defaultProps = {
    setState: (value) => {
        console.log(['DefinitionList', value]);
    }
};

export default DefinitionList;
