import React from 'react';
import PropTypes from 'prop-types';

import { memoize } from '../../../utils';

import ControlGroup from '../../../components/ControlGroup';
import InputField from '../../../components/InputField';
import Panel from '../../../components/Panel';

export class AdventureSession extends React.PureComponent
{
    constructor(props) {
        super(props);
        this.memoize = memoize.bind(this);
    }

    onChange(field) {
        return this.memoize(
            field,
            (value) => this.props.setState({ [field]: value })
        );
    }

    render() {
        const {
            name, id, date, dm_name, dm_dci, setState,
        } = this.props;

        return (
            <Panel
                className="al-log-edit__session"
                header="Adventure"
            >
                <ControlGroup label="Name">
                    <InputField
                        data-field="name"
                        placeholder="Name..."
                        value={name}
                        setState={this.onChange('name')}
                    />
                </ControlGroup>

                <ControlGroup label="Session #">
                    <InputField
                        data-field="id"
                        placeholder="Session #..."
                        value={id}
                        setState={this.onChange('id')}
                    />
                </ControlGroup>

                <ControlGroup label="Date">
                    <InputField
                        data-field="date"
                        placeholder="Date..."
                        type="date"
                        value={date}
                        setState={this.onChange('date')}
                    />
                </ControlGroup>

                <ControlGroup label="DM Name">
                    <InputField
                        data-field="dm_name"
                        placeholder="DM Name..."
                        value={dm_name}
                        setState={this.onChange('dm_name')}
                    />
                </ControlGroup>

                <ControlGroup label="DM DCI">
                    <InputField
                        data-field="dm_dci"
                        placeholder="DM DCI..."
                        value={dm_dci}
                        setState={this.onChange('dm_dci')}
                    />
                </ControlGroup>
            </Panel>
        );
    }
};

AdventureSession.propTypes = {
    setState: PropTypes.func,
    name: PropTypes.string,
    id: PropTypes.string,
    date: PropTypes.string,
    dm_name: PropTypes.string,
    dm_dci: PropTypes.string,
};

AdventureSession.defaultProps = {
    name: '',
    id: '',
    date: '',
    dm_name: '',
    dm_dci: '',
};

export default AdventureSession;
