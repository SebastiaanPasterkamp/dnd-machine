import React from 'react';
import PropTypes from 'prop-types';
import {
    find,
} from 'lodash/fp';

import './sass/_sub-class-edit.scss';

import ListDataWrapper from '../../hocs/ListDataWrapper';
import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import ControlGroup from '../../components/ControlGroup';
import SingleSelect from '../../components/SingleSelect';

import { BaseEditView } from '../../components/DataConfig';

export class SubClassEdit extends React.Component
{
    constructor(props) {
        super(props);
        const {
            class_id,
            classes,
        } = props;
        const {
            subclass_level: startLevel = 1,
            caster_rank: class_caster_rank = 0,
        } = find({id: class_id}, classes) || {};
        this.state = {
            startLevel,
            canBeCaster: class_caster_rank === 0,
        };
        this.onClassChange = this.onClassChange.bind(this);
    }

    onClassChange(class_id) {
        const { setState, classes, caster_rank } = this.props;
        const {
            caster_rank: class_caster_rank = 0,
        } = find({ id: class_id }, classes) || {};

        setState({
            class_id,
            caster_rank: class_caster_rank > 0 ? 0 : caster_rank,
        });
    }

    static getDerivedStateFromProps(props, state) {
        const { class_id, classes, caster_rank } = props;
        const {
            subclass_level: startLevel = 1,
            caster_rank: class_caster_rank = 0,
        } = find({id: class_id}, classes) || {};
        return {
            startLevel,
            canBeCaster: class_caster_rank === 0,
        };
    }

    render() {
        const { canBeCaster, startLevel } = this.state;
        const { class_id, caster_rank, classes, ...props } = this.props;

        return (
            <BaseEditView
                baseClass="sub-class-edit"
                canBeCaster={canBeCaster}
                startLevel={startLevel}
                conditionsTitle="Conditions"
                {...props}
            >

                <ControlGroup label="Class">
                    <SingleSelect
                        selected={class_id}
                        items={classes}
                        setState={this.onClassChange}
                    />
                </ControlGroup>

            </BaseEditView>
        );
    }
}

SubClassEdit.propTypes = {
    id: PropTypes.number,
    class_id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    caster_rank: PropTypes.number,
    config: PropTypes.arrayOf(PropTypes.object),
    phases: PropTypes.arrayOf(PropTypes.object),
    description: PropTypes.string,
    classes: PropTypes.array,
};

SubClassEdit.defaultProps = {
    class_id: null,
    name: '',
    description: '',
    caster_rank: 0,
    config: [],
    phases: [],
    classes: [],
};

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        SubClassEdit,
        {
            className: 'sub-class-edit',
            icon: 'fa-users',
            label: 'Sub Class',
            buttons: ['cancel', 'save']
        },
        "subclass",
        "data"
    ),
    ['class'],
    'data',
    {
        'class': 'classes',
    },
);
