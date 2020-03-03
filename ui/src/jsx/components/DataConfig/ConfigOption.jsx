import React from 'react';
import PropTypes from 'prop-types';

import { memoize } from '../../utils';
import { uuidv4 } from './utils';

import ControlGroup from '../ControlGroup';
import FieldSet from '../FieldSet';
import InputField from '../InputField';
import { SelectListComponent } from '../ListComponent';
import MarkdownTextField from '../MarkdownTextField';
import ToggleSwitch from '../ToggleSwitch';

import ASIOption from './ASIOption';
import ChoiceOption from './ChoiceOption';
import DictOption from './DictOption';
import ListOption from './ListOption';
import MultichoiceOption from './MultichoiceOption';
import ValueOption from './ValueOption';

export class ConfigOption extends React.Component
{
    optionType = 'config';

    options = [
        {
            id: 'ability_score',
            name: 'Ability Score Improvement',
            initialItem: {
                "label": "Ability Score Improvement",
                "description": "You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
                "type": "ability_score",
                "limit": 2,
            },
            component: ASIOption,
        },
        {
            id: 'dict',
            name: 'Dictionary option',
            component: DictOption,
            initialItem: {
                dict: {
                    description: '',
                },
            },
        },
        {
            id: 'choice',
            name: 'Choice option',
            component: ChoiceOption,
        },
        {
            id: 'config',
            name: 'Config option',
            component: ConfigOption,
        },
        {
            id: 'list',
            name: 'List option',
            component: ListOption,
        },
        {
            id: 'multichoice',
            name: 'Multichoice option',
            component: MultichoiceOption,
        },
        {
            id: 'value',
            name: 'Value option',
            component: ValueOption,
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
            label, description, config, canBeHidden, hidden,
        } = this.props;

        return (
            <FieldSet label="Config option">
                {canBeHidden ? (
                    <ToggleSwitch
                        checked={hidden}
                        onChange={this.onFieldChange('hidden')}
                        label="Hidden"
                    />
                ) : null}

                {!(canBeHidden && hidden) ? (
                    <ControlGroup label="Label">
                        <InputField
                            placeholder="Label..."
                            value={label}
                            type="text"
                            setState={this.onFieldChange('label')}
                        />
                    </ControlGroup>
                ) : null}

                {!(canBeHidden && hidden) ? (
                    <ControlGroup label="Description">
                        <MarkdownTextField
                            placeholder="Description..."
                            value={description}
                            className="small"
                            setState={this.onFieldChange('description')}
                        />
                    </ControlGroup>
                ) : null}

                <SelectListComponent
                    list={config}
                    options={this.options}
                    setState={this.onFieldChange('config')}
                />
            </FieldSet>
        );
    }
};

ConfigOption.propTypes = {
    type: PropTypes.oneOf(['config']),
    config: PropTypes.arrayOf(PropTypes.object),
    setState: PropTypes.func.isRequired,
    label: PropTypes.string,
    description: PropTypes.string,
    hidden: PropTypes.bool,
    canBeHidden: PropTypes.bool,
};

ConfigOption.defaultProps = {
    type: 'config',
    config: [],
    label: '',
    description: '',
    hidden: false,
    canBeHidden: true,
};

export default ConfigOption;
