import React from 'react';
import PropTypes from 'prop-types';

import { memoize } from '../../utils';

import ListDataWrapper from '../../hocs/ListDataWrapper.jsx';

import ControlGroup from '../ControlGroup';
import FieldSet from '../FieldSet';
import InputField from '../InputField';
import SingleSelect from '../SingleSelect';
import MarkdownTextField from '../MarkdownTextField';

import { uuidv4 } from './utils';
import DataConfig from './DataConfig';

import ListFilter from './components/ListFilter';

export class MultichoiceOption extends React.Component
{
    optionType = 'multichoice';

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
            name, description, options, includes, include, filter,
            add, limit, replace,
         } = this.props;

        return (
            <FieldSet label="Multichoice option">
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
                    <DataConfig
                        list={options}
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
    filter: PropTypes.arrayOf(
        PropTypes.object
    ),
    add: PropTypes.number,
    limit: PropTypes.number,
    replace: PropTypes.number,
    setState: PropTypes.func.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
};

MultichoiceOption.defaultProps = {
    type: 'multichoice',
    options: [],
    includes: [],
    include: null,
    filter: [],
    add: 0,
    limit: 0,
    replace: 0,
    name: '',
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
