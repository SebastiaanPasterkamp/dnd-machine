import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
    range,
} from 'lodash/fp';

import { memoize } from '../../utils';

import ControlGroup from '../ControlGroup';
import FieldSet from '../FieldSet';
import InputField from '../InputField';
import MarkdownTextField from '../MarkdownTextField';

import {
    DataConfig,
    ListConditions,
    uuidv4,
} from '.';

export class PhasePanel extends React.PureComponent
{
    optionType = 'config';

    constructor(props) {
        super(props);
        const { uuid = uuidv4() } = props;
        this.state = { uuid };
        this.memoize = memoize.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    onFieldChange(field) {
        return this.memoize(field, value => {
            const { uuid: stateUUID } = this.state;
            const { setState, initPhase, uuid = stateUUID } = this.props;
            const init = initPhase(this.props);
            if (init !== null && field === 'config') {
                const { config = [] } = init;
                value = [...config, ...value];
            }
            setState({
                ...init,
                type: this.optionType,
                uuid,
                [field]: value,
            });
        });
    }

    render() {
        const { name, description, config, conditions } = this.props;

        return (
            <React.Fragment>
                { name !== '' ? (
                    <ControlGroup label="Name">
                        <InputField
                            placeholder="Name..."
                            value={name}
                            setState={this.onFieldChange('name')}
                        />
                    </ControlGroup>
                ) : null }

                { name !== '' ? (
                    <ControlGroup label="Description">
                        <MarkdownTextField
                            placeholder="Description..."
                            value={description}
                            setState={this.onFieldChange('description')}
                        />
                    </ControlGroup>
                ) : null }

                { name !== '' ? (
                    <FieldSet label="Conditions">
                        <ListConditions
                            conditions={conditions}
                            setState={this.onFieldChange('conditions')}
                        />
                    </FieldSet>
                ) : null }

                <FieldSet label="Config">
                    <DataConfig
                        list={config}
                        setState={this.onFieldChange('config')}
                    />
                </FieldSet>
            </React.Fragment>
        );
    }
}

PhasePanel.propTypes = {
    uuid: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    conditions: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string,
        value: PropTypes.number,
        min: PropTypes.value,
        max: PropTypes.value,
        needle: PropTypes.any,
        conditions: PropTypes.array,
    })),
    config: PropTypes.arrayOf(PropTypes.object),
    setState: PropTypes.func.isRequired,
    initPhase: PropTypes.func.isRequired,
};

PhasePanel.defaultProps = {
    uuid: undefined,
    name: '',
    description: '',
    config: [],
    conditions: [],
};

export default PhasePanel;
