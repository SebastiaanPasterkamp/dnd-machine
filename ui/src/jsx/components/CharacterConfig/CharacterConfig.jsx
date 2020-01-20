import React from 'react';
import PropTypes from 'prop-types';
import {
    entries,
    flow,
    map,
} from 'lodash/fp';
import MDReactComponent from 'markdown-react-js';

import FormGroup from '../FormGroup';
import LazyComponent from '../LazyComponent';

import ChoiceSelect from './components/ChoiceSelect';
import DictPropertySelect from './components/DictPropertySelect';
import ListPropertySelect from './components/ListPropertySelect';
import ManualInputSelect from './components/ManualInputSelect';
import MultipleChoiceSelect from './components/MultipleChoiceSelect';
import SelectPropertySelect from './components/SelectPropertySelect';
import StatisticsSelect from './components/StatisticsSelect';
import ValuePropertySelect from './components/ValuePropertySelect';

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

        return flow(entries, map(
            ([index, option]) => {
                const {
                    [option.type]: ConfigComponent,
                } = this.components;

                if (!ConfigComponent) {
                    console.log({option});
                    throw `Unknown option type: ${option.type}`;
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
        ))(config);
    }
};

CharacterConfig.propTypes = {
    config: PropTypes.arrayOf(PropTypes.object),
};

CharacterConfig.defaultProps = {
    config: [],
};

export default CharacterConfig;
