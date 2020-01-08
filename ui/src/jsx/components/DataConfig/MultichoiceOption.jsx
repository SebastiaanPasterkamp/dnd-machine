import React from 'react';
import PropTypes from 'prop-types';

import { memoize } from '../../utils';
import { uuidv4 } from './utils';

import ListDataWrapper from '../../hocs/ListDataWrapper.jsx';

import ControlGroup from '../ControlGroup';
import FieldSet from '../FieldSet';
import InputField from '../InputField';
import SingleSelect from '../SingleSelect';
import { SelectListComponent } from '../ListComponent';
import MarkdownTextField from '../MarkdownTextField';

import ASIOption from './ASIOption';
import ChoiceOption from './ChoiceOption';
import ConfigOption from './ConfigOption';
import DictOption from './DictOption';
import ListOption from './ListOption';
import ValueOption from './ValueOption';

import ListFilter from './components/ListFilter';

export class MultichoiceOption extends React.Component
{
    optionType = 'multichoice';

    options = [
        {
            id: 'choice',
            label: 'Choice option',
            component: ChoiceOption,
            componentProps: {
                canBeHidden: false,
            },
        },
        {
            id: 'config',
            label: 'Config option',
            component: ConfigOption,
            componentProps: {
                canBeHidden: false,
            },
        },
        {
            id: 'dict',
            label: 'Dictionary option',
            component: DictOption,
            componentProps: {
                canBeHidden: false,
            },
            initialItem: {
                dict: {
                    description: '',
                },
            },
        },
        {
            id: 'list',
            label: 'List option',
            component: ListOption,
            componentProps: {
                canBeHidden: false,
            },
        },
        {
            id: 'multichoice',
            label: 'Multichoice option',
            component: MultichoiceOption,
            componentProps: {
                canBeHidden: false,
            },
        },
        {
            id: 'value',
            label: 'Value option',
            component: ValueOption,
            componentProps: {
                canBeHidden: false,
            },
        },
    ];

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
            label, description, options, includes, include, filter,
             add, limit, replace,
         } = this.props;

        return (
            <FieldSet label="Multichoice option">
                <ControlGroup label="Label">
                    <InputField
                        placeholder="Label..."
                        value={label}
                        type="text"
                        setState={this.onFieldChange('label')}
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

                <ControlGroup labels={["Add", "Limit", "Replace"]}>
                    <InputField
                        placeholder="Add..."
                        value={add}
                        type="number"
                        min={0}
                        disabled={!!limit}
                        setState={this.onFieldChange('add')}
                    />
                    <InputField
                        placeholder="Limit..."
                        value={limit}
                        type="number"
                        min={0}
                        disabled={!!add}
                        setState={this.onFieldChange('limit')}
                    />
                    <InputField
                        placeholder="Replace..."
                        value={replace}
                        type="number"
                        min={0}
                        setState={this.onFieldChange('replace')}
                    />
                </ControlGroup>

                {includes.length && !options.length ? (
                    <ControlGroup label="Include">
                        <SingleSelect
                            selected={include}
                            items={includes}
                            renderEmpty="Include option..."
                            setState={this.onFieldChange('include')}
                        />
                    </ControlGroup>
                ) : null}

                {include && (add || replace || limit) ? (
                    <FieldSet label="Filter">
                        <ListFilter
                            filter={filter}
                            setState={this.onFieldChange('filter')}
                        />
                    </FieldSet>
                ) : null}

                {!include ? (
                    <SelectListComponent
                        list={options}
                        options={this.options}
                        setState={this.onFieldChange('options')}
                    />
                ) : null}
            </FieldSet>
        );
    }
};

MultichoiceOption.propTypes = {
    type: PropTypes.oneOf(['multichoice']),
    options: PropTypes.arrayOf(PropTypes.object),
    includes: PropTypes.arrayOf(PropTypes.object),
    include: PropTypes.number,
    filter: PropTypes.object,
    add: PropTypes.number,
    limit: PropTypes.number,
    replace: PropTypes.number,
    setState: PropTypes.func.isRequired,
    label: PropTypes.string,
    description: PropTypes.string,
};

MultichoiceOption.defaultProps = {
    type: 'multichoice',
    options: [],
    includes: [],
    include: null,
    filter: {},
    add: 0,
    limit: 0,
    replace: 0,
    label: '',
    description: '',
};

export default ListDataWrapper(
    MultichoiceOption,
    ['options'],
    'data',
    {
        'options': 'includes',
    }
);
