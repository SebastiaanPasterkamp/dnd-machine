import React from 'react';
import PropTypes from 'prop-types';
import {
    entries,
    flow,
    map,
} from 'lodash/fp';
import MDReactComponent from 'markdown-react-js';

import FormGroup from '../FormGroup.jsx';
import LazyComponent from '../LazyComponent.jsx';

import ChoiceSelect from './components/ChoiceSelect.jsx';
import DictPropertySelect from './components/DictPropertySelect.jsx';
import ListPropertySelect from './components/ListPropertySelect.jsx';
import ManualInputSelect from './components/ManualInputSelect.jsx';
import MultipleChoiceSelect from './components/MultipleChoiceSelect.jsx';
import SelectPropertySelect from './components/SelectPropertySelect.jsx';
import StatisticsSelect from './components/StatisticsSelect.jsx';
import ValuePropertySelect from './components/ValuePropertySelect.jsx';

export class CharacterConfig extends LazyComponent
{
    constructor(props) {
        super(props);
        this.components = {
            ability_score: StatisticsSelect,
            choice: ChoiceSelect,
            config: CharacterConfig,
            dict: DictPropertySelect,
            list: ListPropertySelect,
            multichoice: MultipleChoiceSelect,
            select: SelectPropertySelect,
            value: ValuePropertySelect,
            manual: ManualInputSelect,
        };
    }

    render() {
        const {
            config,
        } = this.props;

        return (
            <React.Fragment>{flow(entries, map(
                ([index, option]) => {
                    const ConfigComponent = this.components[option.type];

                    if (!ConfigComponent) {
                        console.log({option});
                        throw "Unknown option type: " + option.type;
                    }

                    const {
                        description, label, hidden, described,
                        ...props
                    } = option;
                    if (hidden || described) {
                        props.hidden = true;
                    }

                    return (
                        <FormGroup
                            key={ index }
                            label={ label }
                        >
                            {description && (
                                <MDReactComponent
                                    text={ description }
                                />
                            )}
                            <ConfigComponent
                                {...props}
                            />
                        </FormGroup>
                    );
                }
            ))(config)}</React.Fragment>
        );
    }
};

CharacterConfig.propTypes = {
    config: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CharacterConfig;
