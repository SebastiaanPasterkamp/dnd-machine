import React from 'react';
import PropTypes from 'prop-types';
import {
    includes,
    isEmpty,
    range,
} from 'lodash/fp';

import { memoize } from '../utils';

import '../../sass/_spell-edit.scss';

import ListDataWrapper from '../hocs/ListDataWrapper';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper';

import ControlGroup from '../components/ControlGroup';
import CostEditor from '../components/CostEditor';
import DamageEdit from '../components/DamageEdit';
import InputField from '../components/InputField';
import Panel from '../components/Panel';
import MarkdownTextField from '../components/MarkdownTextField';
import MultiSelect from '../components/MultiSelect';
import ReachEdit from '../components/ReachEdit';
import SingleSelect from '../components/SingleSelect';
import TextField from '../components/TextField';
import TagContainer from '../components/TagContainer';

export class SpellEdit extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            cost: '',
        };
        this.levels = range(0, 11).map((level) => {
            return {
                code: level
                    ? level.toString()
                    : 'Cantrip',
                label: level
                    ? 'Level ' + level
                    : 'Cantrip',
            };
        });
        this.memoize = memoize.bind(this);
    }

    componentDidMount() {
        const { setState } = this.props;
        const fix = this.fixConditionalFields();
        if (!isEmpty(fix)) {
            setState(fix);
        }
    }

    fixConditionalFields(update={}) {
        const {
            components, cost
        } = {...this.props, ...update};
        let state = {};

        if (includes('material', components)) {
            if (cost === null || cost === undefined) {
                update.cost = this.state.cost;
            }
        } else if (cost !== null) {
            state.cost = cost;
            update.cost = undefined;
        }

        if (!isEmpty(state)) {
            this.setState(state);
        }

        return update;
    }

    onFieldChange = (field) => {
        const { setState } = this.props;
        return this.memoize(field, (value) => {
            const update = this.fixConditionalFields({
                [field]: value,
            });
            setState(update);
        });
    }

    render() {
        const {
            casting_time, classes, _classes,
            components, magic_components, cost, damage,
            description, duration, level, name, range, school,
            magic_schools,
        } = this.props;

        return <React.Fragment>
            <Panel
                key="properties"
                className="spell-edit__properties"
                header="Description"
            >
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={name}
                        setState={this.onFieldChange('name')}
                    />
                </ControlGroup>
                <ControlGroup label="Level">
                    <SingleSelect
                        selected={level}
                        items={this.levels}
                        setState={this.onFieldChange('level')}
                    />
                </ControlGroup>
                <ControlGroup label="Classes">
                    <TagContainer
                        value={classes}
                        items={_classes}
                        setState={this.onFieldChange('classes')}
                    />
                </ControlGroup>
                <ControlGroup label="School">
                    <SingleSelect
                        selected={school}
                        items={magic_schools}
                        setState={this.onFieldChange('school')}
                    />
                </ControlGroup>
                <ReachEdit
                    distance={range}
                    setState={this.onFieldChange('range')}
                />
                <ControlGroup label="Casting Time">
                    <InputField
                        placeholder="Casting Time..."
                        value={casting_time}
                        setState={this.onFieldChange('casting_time')}
                    />
                </ControlGroup>
                <ControlGroup label="Duration">
                    <InputField
                        placeholder="Duration..."
                        value={duration}
                        setState={this.onFieldChange('duration')}
                    />
                </ControlGroup>
                <DamageEdit
                    {...damage}
                    setState={this.onFieldChange('damage')}
                />
                <ControlGroup label="Components">
                    <TagContainer
                        value={components}
                        items={magic_components}
                        setState={this.onFieldChange('components')}
                    />
                </ControlGroup>
                {cost !== null ? (
                    <ControlGroup label="Cost">
                        <InputField
                            placeholder="Cost..."
                            value={cost}
                            setState={this.onFieldChange('cost')}
                        />
                    </ControlGroup>
                ) : null}
            </Panel>

            <Panel
                    key="description"
                    className="spell-edit__description"
                    header="Special"
                >
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Description..."
                        value={description}
                        rows={5}
                        setState={this.onFieldChange('description')}
                    />
                </ControlGroup>
            </Panel>
        </React.Fragment>;
    }
};

SpellEdit.propTypes = {
    casting_time: PropTypes.string,
    cost: PropTypes.string,
    damage: PropTypes.object,
    description: PropTypes.string,
    duration: PropTypes.string,
    level: PropTypes.string,
    name: PropTypes.string,
    range: PropTypes.string,
    school: PropTypes.string,
    classes: PropTypes.array,
    _classes: PropTypes.array,
    components: PropTypes.array,
    magic_components: PropTypes.array,
    magic_schools: PropTypes.array,
};

SpellEdit.defaultProps = {
    classes: [],
    cost: null,
    description: '',
    level: 'Cantrip',
    _classes: [],
    components: [],
    magic_components: [],
    magic_schools: [],
};

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        SpellEdit, {
            className: 'spell-edit',
            icon: 'fa-magic',
            label: 'Spell',
            buttons: ['cancel', 'reload', 'save']
        },
        "spell",
        "items"
    ),
    [
        "magic_components",
        "magic_schools",
        "classes",
    ],
    'items',
    {
        'classes': '_classes'
    }
);
