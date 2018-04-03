import React from 'react';
import PropTypes from 'prop-types';

import FormGroup from '../FormGroup.jsx';
import LazyComponent from '../LazyComponent.jsx';

import AbilityScoreSelect from './AbilityScoreSelect.jsx';
import ChoiceSelect from './ChoiceSelect.jsx';
import DictPropertySelect from './DictPropertySelect.jsx';
import ListPropertySelect from './ListPropertySelect.jsx';
import MultipleChoiceSelect from './MultipleChoiceSelect.jsx';
import SelectPropertySelect from './SelectPropertySelect.jsx';
import ValuePropertySelect from './ValuePropertySelect.jsx';

class CharacterConfig extends LazyComponent
{
    constructor(props) {
        super(props);
        this.components = {
            ability_score: AbilityScoreSelect,
            choice: ChoiceSelect,
            config: CharacterConfig,
            dict: DictPropertySelect,
            list: ListPropertySelect,
            multichoice: MultipleChoiceSelect,
            select: SelectPropertySelect,
            value: ValuePropertySelect,
        };
    }

    render() {
        const {
            config, onChange, getCurrent, getItems
        } = this.props;

        return <React.Fragment>{_.map(config, (option, index) => {
            const ConfigComponent = this.components[option.type];

            if (ConfigComponent == undefined) {
                console.log(option);
                return null;
            }

            const props = {
                index: this.props.index.concat([index]),
            };
            props.onChange = (
                path, value, idx=null, opt=null
            ) => onChange(
                path,
                value,
                idx || props.index,
                opt || option,
            );

            if (_.includes(
                ['choice', 'config', 'multichoice'],
                option.type
            )) {
                props.getCurrent = getCurrent;
                props.getItems = getItems;
            }

            if ('list' in option) {
                props.items = getItems(option.list);
            } else if ('items' in option) {
                if (_.isArray(option.items)) {
                    props.items = _.map(option.items, i => ({
                        code: i,
                        label: i
                    }));
                } else {
                    props.items = option.items;
                }
            }
            if ('path' in option) {
                props.current = getCurrent(option.path);
            }

            if (option.label) {
                return <FormGroup
                        label={option.label}
                        key={index}
                        >
                    <ConfigComponent
                        {...option}
                        {...props}
                        />
                </FormGroup>;
            }

            return <ConfigComponent
                    key={index}
                    {...option}
                    {...props}
                    />;
        })}</React.Fragment>
    }
};

CharacterConfig.propTypes = {
    onChange: PropTypes.func.isRequired,
    index: PropTypes.arrayOf(PropTypes.number).isRequired,
    getCurrent: PropTypes.func.isRequired,
    getItems: PropTypes.func.isRequired,
    config: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CharacterConfig;
