import React from 'react';
import PropTypes from 'prop-types';
import {
    find,
} from 'lodash/fp';

import { memoize } from '../../utils';

import ListDataWrapper from '../../hocs/ListDataWrapper.jsx';

import ControlGroup from '../ControlGroup';
import FieldSet from '../FieldSet';
import InputField from '../InputField';
import MarkdownTextField from '../MarkdownTextField';
import SingleSelect from '../SingleSelect';
import ToggleSwitch from '../ToggleSwitch';

import { uuidv4 } from './utils';
import DataConfig from './DataConfig';
import ListFilter from './components/ListFilter';


export class ChoiceOption extends React.Component
{
    optionType = 'choice';

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
            name, description, options, includes, include, filter, subtype,
        } = this.props;

        return (
            <FieldSet label="Choice option">
                <ControlGroup label="Label">
                    <InputField
                        placeholder="Label..."
                        value={name}
                        type="text"
                        setState={this.onFieldChange('name')}
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

                {includes.length && !(options.length || subtype) ? (
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
                            items={(
                                find({id: include}, includes) || {}
                            ).options}
                            setState={this.onFieldChange('filter')}
                        />
                    </FieldSet>
                ) : null}

                {!(include || options.length) ? (
                    <ToggleSwitch
                        checked={subtype}
                        onChange={this.onFieldChange('subtype')}
                        label="Include sub-type choice"
                    />
                ) : null}

                {!(include || subtype) ? (
                    <DataConfig
                        list={options}
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
    filter: PropTypes.arrayOf(
        PropTypes.object
    ),
    subtype: PropTypes.bool,
    setState: PropTypes.func.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
};

ChoiceOption.defaultProps = {
    type: 'choice',
    options: [],
    includes: [],
    include: null,
    filter: [],
    subtype: false,
    name: '',
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
