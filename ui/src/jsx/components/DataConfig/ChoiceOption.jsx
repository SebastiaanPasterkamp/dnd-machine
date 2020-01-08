import React from 'react';
import PropTypes from 'prop-types';

import { memoize } from '../../utils';
import { uuidv4 } from './utils';

import ListDataWrapper from '../../hocs/ListDataWrapper.jsx';

import ControlGroup from '../ControlGroup';
import FieldSet from '../FieldSet';
import InputField from '../InputField';
import { SelectListComponent } from '../ListComponent';
import MarkdownTextField from '../MarkdownTextField';

import ASIOption from './ASIOption';
import ConfigOption from './ConfigOption';
import DictOption from './DictOption';
import ListOption from './ListOption';
import MultichoiceOption from './MultichoiceOption';
import SingleSelect from '../SingleSelect';
import ValueOption from './ValueOption';

import ListFilter from './components/ListFilter';

export class ChoiceOption extends React.Component
{
    optionType = 'choice';

    options = [
        {
            id: 'ability_score',
            label: 'Ability Score Improvement',
            component: ASIOption,
            componentProps: {
                canBeHidden: false,
            },
            initialItem: {
                "label": "Ability Score Improvement",
                "description": "You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
                "type": "ability_score",
                "limit": 2,
            },
        },
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
        } = this.props;

        return (
            <FieldSet label="Choice option">
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

                {include ? (
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

ChoiceOption.propTypes = {
    type: PropTypes.oneOf(['choice']),
    options: PropTypes.arrayOf(PropTypes.object),
    includes: PropTypes.arrayOf(PropTypes.object),
    include: PropTypes.number,
    filter: PropTypes.object,
    setState: PropTypes.func.isRequired,
    label: PropTypes.string,
    description: PropTypes.string,
};

ChoiceOption.defaultProps = {
    type: 'choice',
    options: [],
    includes: [],
    include: null,
    filter: {},
    label: '',
    description: '',
};

export default ListDataWrapper(
    ChoiceOption,
    ['options'],
    'data',
    {
        'options': 'includes',
    }
);
