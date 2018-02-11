import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import LazyComponent from './LazyComponent.jsx';

import ControlGroup from './ControlGroup.jsx';
import InputField from './InputField.jsx';

export class ReachEdit extends LazyComponent
{
    constructor(props) {
        super(props);
    }

    onFieldMinMax(field, value) {
        let state = _.assign(
            {},
            {
                min: this.props.min,
                max: this.props.max
            },
            {[field]: value}
        );
        this.props.setState(state);
    }

    onFieldSingle(value) {
        this.props.setState(value);
    }

    renderMinMax(min, max) {
        return <ControlGroup labels={["Reach", "ft.", "ft."]}>
            <InputField
                type="number"
                placeholder="Normal..."
                value={min || ''}
                setState={(value) => {
                    this.onFieldMinMax('min', value);
                }} />
            <InputField
                type="number"
                placeholder="Disadvantage..."
                value={max || ''}
                setState={(value) => {
                    this.onFieldMinMax('max', value);
                }} />
        </ControlGroup>;
    }

    renderSingle(distance) {
        return <ControlGroup labels={["Reach", "ft."]}>
            <InputField
                type="number"
                placeholder="Distance..."
                value={distance || ''}
                setState={(value) => {
                    this.onFieldSingle(value);
                }} />
        </ControlGroup>;
    }

    render() {
        const {
            min, max, distance, singleDistance
        } = this.props;
        if (
            singleDistance != null
                ? singleDistance
                : 'distance' in this.props
        ) {
            return this.renderSingle(distance);
        }
        return this.renderMinMax(min, max);
    }
}

ReachEdit.defaultProps = {
    setState: (value) => {
        console.log(['ReachEdit', value]);
    }
};

ReachEdit.propTypes = {
    setState: PropTypes.func.isRequired,
    distance: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    min: PropTypes.number,
    max: PropTypes.number,
    singleDistance: PropTypes.bool,
};

export default ReachEdit;
