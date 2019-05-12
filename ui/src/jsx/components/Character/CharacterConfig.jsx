import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import FormGroup from '../FormGroup.jsx';
import LazyComponent from '../LazyComponent.jsx';

import ChoiceSelect from './ChoiceSelect.jsx';
import DictPropertySelect from './DictPropertySelect.jsx';
import ListPropertySelect from './ListPropertySelect.jsx';
import ManualInputSelect from './ManualInputSelect.jsx';
import MultipleChoiceSelect from './MultipleChoiceSelect.jsx';
import SelectPropertySelect from './SelectPropertySelect.jsx';
import StatisticsSelect from './StatisticsSelect.jsx';
import ValuePropertySelect from './ValuePropertySelect.jsx';

import utis from '../../utils.jsx';

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

        return <React.Fragment>{_.map(config, (option, index) => {
            const ConfigComponent = this.components[option.type];

            if (!ConfigComponent) {
                console.log({option});
                throw "Unknown option type: " + option.type;
            }

            let {
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
        })}</React.Fragment>
    }
};

CharacterConfig.propTypes = {
    config: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CharacterConfig;
