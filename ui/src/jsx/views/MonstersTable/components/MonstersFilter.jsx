import React from 'react';
import propTypes from 'prop-types';
import {
    map,
    range,
    values,
} from 'lodash/fp';

import ListDataWrapper from '../../../hocs/ListDataWrapper';
import ObjectDataListWrapper from '../../../hocs/ObjectDataListWrapper';

import ControlGroup from '../../../components/ControlGroup';
import InputField from '../../../components/InputField';
import MultiSelect from '../../../components/MultiSelect';

import { memoize } from '../../../utils';

export class MonstersFilter extends React.Component
{
    constructor(props) {
        super(props);

        this.levels = map(i => ({
            code: i,
            label: `Level ${i}`,
        }))(range(1, 31));

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
            text, size, size_hit_dice, type, monster_types,
            alignment, alignments, campaign, campaigns, level, cr, xp,
        } = this.props;

        return (
            <div className="monsters-table--filter">
                <ControlGroup className="monsters-table--filter-select" label="Name">
                    <InputField
                        data-name="search"
                        type="text"
                        value={text}
                        placeholder="Search..."
                        setState={this.onChange('text')}
                    />
                </ControlGroup>
                <ControlGroup className="monsters-table--filter-select" label="Campaign">
                    <MultiSelect
                        data-name="campaign"
                        items={values(campaigns)}
                        selected={campaign}
                        emptyLabel="All Campaigns..."
                        setState={this.onChange('campaign')}
                    />
                </ControlGroup>
                <ControlGroup className="monsters-table--filter-select" label="Size">
                    <MultiSelect
                        data-name="size"
                        items={size_hit_dice}
                        selected={size}
                        emptyLabel="All Sizes"
                        setState={this.onChange('size')}
                    />
                </ControlGroup>
                <ControlGroup className="monsters-table--filter-select" label="Type">
                    <MultiSelect
                        data-name="types"
                        items={monster_types}
                        selected={type}
                        emptyLabel="All Types"
                        setState={this.onChange('type')}
                    />
                </ControlGroup>
                <ControlGroup className="monsters-table--filter-select" label="Alignment">
                    <MultiSelect
                        data-name="alignment"
                        items={alignments}
                        selected={alignment}
                        emptyLabel="All Alignments"
                        setState={this.onChange('alignment')}
                    />
                </ControlGroup>
                <ControlGroup className="monsters-table--filter-select" label="Level">
                    <MultiSelect
                        data-name="levels"
                        items={this.levels}
                        selected={level}
                        emptyLabel="Any Level..."
                        setState={this.onChange('level')}
                    />
                </ControlGroup>
                <ControlGroup
                    data-name="cr"
                    className="monsters-table--filter-min-max"
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
                    className="monsters-table--filter-min-max"
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

MonstersFilter.propTypes = {
    text: propTypes.string,
    campaign: propTypes.arrayOf( propTypes.number ),
    campaigns: propTypes.objectOf( propTypes.shape({
        id: propTypes.number,
        name: propTypes.string,
    }) ),
    size: propTypes.arrayOf( propTypes.string ),
    size_hit_dice: propTypes.array,
    type: propTypes.arrayOf( propTypes.string ),
    monster_types: propTypes.array,
    alignment: propTypes.arrayOf( propTypes.string ),
    alignments: propTypes.array,
    level: propTypes.arrayOf( propTypes.number ),
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

MonstersFilter.defaultProps = {
    text: '',
    campaign: [],
    campaigns: {},
    size: [],
    size_hit_dice: [],
    type: [],
    monster_types: [],
    alignment: [],
    alignments: [],
    level: [],
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
    ListDataWrapper(
        MonstersFilter,
        [
            'alignments',
            'size_hit_dice',
            'monster_types',
        ],
        'items'
    ),
    {campaigns: {type: 'campaign'}}
);
