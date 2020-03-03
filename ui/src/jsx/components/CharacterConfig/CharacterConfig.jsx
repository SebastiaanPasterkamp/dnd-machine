import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
} from 'lodash/fp';
import MDReactComponent from 'markdown-react-js';

import FormGroup from '../FormGroup';

import ChoiceSelect from './components/ChoiceSelect';
import DictPropertySelect from './components/DictPropertySelect';
import ListPropertySelect from './components/ListPropertySelect';
import ManualInputSelect from './components/ManualInputSelect';
import MultipleChoiceSelect from './components/MultipleChoiceSelect';
import SelectPropertySelect from './components/SelectPropertySelect';
import StatisticsSelect from './components/StatisticsSelect';
import ValuePropertySelect from './components/ValuePropertySelect';

export class CharacterConfig extends React.Component
{
    render() {
        const { config } = this.props;

        return map(
            (option) => {
                const {
                    [option.type]: ConfigComponent,
                } = ComponentMap;

                if (!ConfigComponent) {
                    console.log({option});
                    throw `Unknown option type: '${option.type} ${option.uuid}'`;
                }

                const {
                    description, label, hidden, described, uuid,
                    ...props
                } = option;
                if (hidden || described) {
                    props.hidden = true;
                }

                return (
                    <FormGroup
                        key={ uuid }
                        label={ label }
                    >
                        {description && (
                            <MDReactComponent
                                text={ description }
                            />
                        )}
                        <ConfigComponent
                            uuid={ uuid }
                            {...props}
                        />
                    </FormGroup>
                );
            }
        )(config);
    }
};

const ComponentMap = {
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

CharacterConfig.propTypes = {
    type: PropTypes.oneOf(['config']).isRequired,
    uuid: PropTypes.string.isRequired,
    config: PropTypes.arrayOf(PropTypes.object),
};

CharacterConfig.defaultProps = {
    type: 'config',
    config: [],
};

export default CharacterConfig;
