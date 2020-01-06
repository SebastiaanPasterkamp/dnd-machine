import React from 'react';
import PropTypes from 'prop-types';
import {
    get,
} from 'lodash/fp';

import { memoize } from '../../../utils';

import ListDataWrapper from '../../../hocs/ListDataWrapper';

import DamageEdit from '../../../components/DamageEdit';
import ControlGroup from '../../../components/ControlGroup';
import InputField from '../../../components/InputField';
import ReachEdit from '../../../components/ReachEdit';
import SingleSelect from '../../../components/SingleSelect';
import { ListComponent } from '../../../components/ListComponent';
import MarkdownTextField from '../../../components/MarkdownTextField';

export class AttackEditor extends React.Component
{
    constructor(props) {
        super(props);
        this.memoize = memoize.bind(this);
    }

    onFieldChange(field) {
        const { setState } = this.props;
        return this.memoize(
            field,
            (value, callback=null) => setState(
                {[field]: value },
                callback
            )
        );
    }

    render() {
        const {
            name, description, damage, target, target_methods,
            mode, attack_modes, reach, on_hit, on_mis,
        } = this.props;
        const damageTypes = get('type', damage);

        return (
            <div className="edit-attack">
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        data-field="name"
                        value={name}
                        setState={this.onFieldChange('name')}
                    />
                </ControlGroup>
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={description}
                        rows={5}
                        setState={this.onFieldChange('description')}
                    />
                </ControlGroup>
                <ListComponent
                    list={damage}
                    component={DamageEdit}
                    newItem="initial"
                    keyProp="type"
                    setState={this.onFieldChange('damage')}
                    componentProps={{
                        disabledTypes: damageTypes
                    }}
                />
                <ControlGroup label="Target">
                    <SingleSelect
                        emptyLabel="Target..."
                        selected={target}
                        items={target_methods}
                        setState={this.onFieldChange('target')}
                    />
                </ControlGroup>
                <ControlGroup label="Mode">
                    <SingleSelect
                        emptyLabel="Mode..."
                        selected={mode}
                        items={attack_modes}
                        setState={this.onFieldChange('mode')}
                    />
                </ControlGroup>
                <ReachEdit
                    {...reach}
                    setState={this.onFieldChange('reach')}
                />
                <ControlGroup label="On Hit">
                    <MarkdownTextField
                        className="small"
                        placeholder="Bad stuff..."
                        value={on_hit}
                        rows={5}
                        setState={this.onFieldChange('on_hit')}
                    />
                </ControlGroup>
                <ControlGroup label="On Mis">
                    <MarkdownTextField
                        className="small"
                        placeholder="Still bad stuff..."
                        value={on_mis}
                        rows={5}
                        setState={this.onFieldChange('on_mis')}
                    />
                </ControlGroup>
            </div>
        );
    }
}

AttackEditor.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    damage: PropTypes.array,
    target: PropTypes.string,
    target_methods: PropTypes.array,
    mode: PropTypes.string,
    attack_modes: PropTypes.array,
    reach: PropTypes.object,
    on_hit: PropTypes.string,
    on_mis: PropTypes.string,
    setState: PropTypes.func.isRequired,
};

AttackEditor.defaultProps = {
    name: '',
    description: '',
    damage: [],
    target: '',
    target_methods: [],
    mode: '',
    attack_modes: [],
    reach: {},
    on_hit: '',
    on_mis: '',
};

export default ListDataWrapper(
    AttackEditor,
    [
        'target_methods',
        'attack_modes',
    ],
    'items'
);
