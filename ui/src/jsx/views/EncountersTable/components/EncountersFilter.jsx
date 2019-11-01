import React from 'react';
import propTypes from 'prop-types';
import {
    map,
    range,
    values,
} from 'lodash/fp';

import ObjectDataListWrapper from '../../../hocs/ObjectDataListWrapper';

import ControlGroup from '../../../components/ControlGroup';
import InputField from '../../../components/InputField';
import MultiSelect from '../../../components/MultiSelect';

import { memoize } from '../../../utils';

export class EncountersFilter extends React.Component
{
    constructor(props) {
        super(props);

        this.memoize = memoize.bind(this);
    }

    onChange(field) {
        const { setState } = this.props;
        return this.memoize(field, (value) => {
            setState({ [field]: value });
        });
    }

    onMinMaxChange(field, key) {
        const { setState } = this.props;
        return this.memoize(`${field}.${key}`, (value) => {
            const { [field]: orig } = this.props;
            setState({
                [field]: {
                    ...orig,
                    [key]: value,
                }
            });
        });
    }

    render() {
        const {
            text, campaign, campaigns, cr, xp,
        } = this.props;

        return (
            <div className="encounters-table--filter">
                <ControlGroup className="encounters-table--filter-select" label="Name">
                    <InputField
                        data-name="search"
                        type="text"
                        value={text}
                        placeholder="Search..."
                        setState={this.onChange('text')}
                    />
                </ControlGroup>
                <ControlGroup className="encounters-table--filter-select" label="Campaign">
                    <MultiSelect
                        data-name="campaign"
                        items={values(campaigns)}
                        selected={campaign}
                        emptyLabel="All Campaigns..."
                        setState={this.onChange('campaign')}
                    />
                </ControlGroup>
                <ControlGroup
                    data-name="cr"
                    className="encounters-table--filter-min-max"
                    labels={["CR", "min", "max"]}
                >
                    <InputField
                        type="number"
                        placeholder="Min..."
                        value={cr.min == null ? '' : cr.min}
                        setState={this.onMinMaxChange('cr', 'min')}
                    />
                    <InputField
                        type="number"
                        placeholder="Max..."
                        value={cr.max == null ? '' : cr.max}
                        setState={this.onMinMaxChange('cr', 'max')}
                    />
                </ControlGroup>
                <ControlGroup
                    data-name="xp"
                    className="encounters-table--filter-min-max"
                    labels={["XP", "min", "max"]}
                >
                    <InputField
                        type="number"
                        placeholder="Min..."
                        value={xp.min == null ? '' : xp.min}
                        setState={this.onMinMaxChange('xp', 'min')}
                    />
                    <InputField
                        type="number"
                        placeholder="Max..."
                        value={xp.max == null ? '' : xp.max}
                        setState={this.onMinMaxChange('xp', 'max')}
                    />
                </ControlGroup>
            </div>
        );
    }
};

EncountersFilter.propTypes = {
    text: propTypes.string,
    campaign: propTypes.arrayOf( propTypes.number ),
    campaigns: propTypes.objectOf( propTypes.shape({
        id: propTypes.number,
        name: propTypes.string,
    }) ),
    cr: propTypes.shape({
        min: propTypes.number,
        max: propTypes.number,
    }),
    xp: propTypes.shape({
        min: propTypes.number,
        max: propTypes.number,
    }),
    setState: propTypes.func.isRequired,
};

EncountersFilter.defaultProps = {
    text: '',
    campaign: [],
    campaigns: {},
    cr: {
        min: null,
        max: null,
    },
    xp: {
        min: null,
        max: null,
    },
};

export default ObjectDataListWrapper(
    EncountersFilter,
    {campaigns: {type: 'campaign'}}
);
