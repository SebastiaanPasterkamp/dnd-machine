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

export class NpcsFilter extends React.Component
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

    render() {
        const {
            text, alignment, alignments, campaign, campaigns,
        } = this.props;

        return (
            <div className="npcs-table--filter">
                <ControlGroup className="npcs-table--filter-select" label="Name">
                    <InputField
                        data-name="search"
                        type="text"
                        value={text}
                        placeholder="Search..."
                        setState={this.onChange('text')}
                    />
                </ControlGroup>
                <ControlGroup className="npcs-table--filter-select" label="Campaign">
                    <MultiSelect
                        data-name="campaign"
                        items={values(campaigns)}
                        selected={campaign}
                        emptyLabel="All Campaigns..."
                        setState={this.onChange('campaign')}
                        renderEmpty="Unassigned"
                    />
                </ControlGroup>
                <ControlGroup className="npcs-table--filter-select" label="Alignment">
                    <MultiSelect
                        data-name="alignment"
                        items={alignments}
                        selected={alignment}
                        emptyLabel="All Alignments"
                        setState={this.onChange('alignment')}
                    />
                </ControlGroup>
            </div>
        );
    }
};

NpcsFilter.propTypes = {
    text: propTypes.string,
    campaign: propTypes.arrayOf( propTypes.number ),
    campaigns: propTypes.objectOf( propTypes.shape({
        id: propTypes.number,
        name: propTypes.string,
    }) ),
    alignment: propTypes.arrayOf( propTypes.string ),
    alignments: propTypes.array,
    setState: propTypes.func.isRequired,
};

NpcsFilter.defaultProps = {
    text: '',
    campaign: [],
    campaigns: {},
    alignment: [],
    alignments: [],
};

export default ObjectDataListWrapper(
    ListDataWrapper(
        NpcsFilter,
        [
            'alignments',
        ],
        'items'
    ),
    {campaigns: {type: 'campaign'}}
);
