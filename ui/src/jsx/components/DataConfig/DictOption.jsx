import React from 'react';
import PropTypes from 'prop-types';
import {
    isNumber,
    map,
    keys,
    reduce,
    values,
} from 'lodash/fp';

import { memoize } from '../../utils';

import { SelectListComponent } from '../ListComponent';

import ControlGroup from '../ControlGroup';
import FieldSet from '../FieldSet';
import InputField from '../InputField';

import { uuidv4 } from './utils';
import DictFormulaField from './components/DictFormulaField';
import DictNumberField from './components/DictNumberField';
import DictTextField from './components/DictTextField';


export class DictOption extends React.Component
{
    optionType = 'dict';

    options = [
        {
            id: 'formula',
            name: 'Formula value',
            component: DictFormulaField,
            initialItem: {
                type: 'formula',
                field: '',
                formula: '',
                alttext: '',
            },
        },
        {
            id: 'number',
            name: 'Numeric value',
            component: DictNumberField,
            initialItem: {
                type: 'number',
                field: '',
                number: 0,
            },
        },
        {
            id: 'text',
            name: 'Text value',
            component: DictTextField,
            initialItem: {
                type: 'text',
                field: '',
                text: '',
            },
        },
    ]

    constructor(props) {
        super(props);
        const { uuid = uuidv4() } = props;
        this.state = { uuid };
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onDictChange = this.onDictChange.bind(this);
        this.memoize = memoize.bind(this);
    }

    onDictChange(list) {
        const { uuid } = this.state;
        const { setState } = this.props;

        const dict = reduce(
            (dict, item) => {
                if (item.type == 'formula') {
                    dict[`${item.field}_formula`] = item.formula;
                    dict[`${item.field}_default`] = item.alttext;
                }
                if (item.type == 'text') {
                    dict[item.field] = item.text;
                }
                if (item.type == 'number') {
                    dict[item.field] = item.number;
                }
                return dict;
            },
            {}
        )(list);

        setState({ type: this.optionType, uuid, dict });
    }

    dictToList() {
        const { dict } = this.props;
        const list = reduce(
            (list, field) => {
                const value = dict[field];
                let type = 'text';
                let key = 'text';

                if (field.match(/_(formula|default)$/)) {
                    type = 'formula';
                    key = field.match(/_formula$/) ? 'formula' : 'alttext';
                    field = field.replace(/_(formula|default)$/, '');
                } else if (isNumber(value)) {
                    type = 'number';
                    key = 'number';
                }

                list[field] = {
                    ...list[field],
                    field,
                    type,
                    [key]: value,
                };
                return list;
            },
            {}
        )(keys(dict));

        return values(list);
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
        const { name, path, dict } = this.props;

        return (
            <FieldSet label="Dictionary option">
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

                <SelectListComponent
                    list={this.dictToList()}
                    options={this.options}
                    setState={this.onDictChange}
                />
            </FieldSet>
        );
    }
};

DictOption.propTypes = {
    type: PropTypes.oneOf(['dict']),
    path: PropTypes.string,
    name: PropTypes.string,
    dict: PropTypes.object,
    setState: PropTypes.func.isRequired,
};

DictOption.defaultProps = {
    type: 'dict',
    path: '',
    name: '',
    dict: {},
};

export default DictOption;
