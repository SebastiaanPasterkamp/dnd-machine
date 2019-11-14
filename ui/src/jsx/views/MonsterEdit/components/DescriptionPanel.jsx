import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
    range,
    values,
} from 'lodash/fp';

import { memoize } from '../../../utils';

import ListDataWrapper from '../../../hocs/ListDataWrapper';
import ObjectDataListWrapper from '../../../hocs/ObjectDataListWrapper';

import ControlGroup from '../../../components/ControlGroup';
import InputField from '../../../components/InputField';
import Panel from '../../../components/Panel';
import SingleSelect from '../../../components/SingleSelect';
import MarkdownTextField from '../../../components/MarkdownTextField';

export class DescriptionPanel extends React.Component
{
    constructor(props) {
        super(props);

        this.levels = map(i => ({
            code: i,
            label: i,
        }))(range(1, 30));
        this.armor_classes = map(i => ({
            code: i,
            label: i,
        }))(range(10, 20));
        this.memoize = memoize.bind(this);
    }

    onFieldChange(field) {
        return this.memoize(
            field,
            (value) => {
                const { setState } = this.props;
                setState({ [field]: value });
            }
        );
    }

    render() {
        const {
            campaign_id, campaigns, currentCampaign,
            name, size, size_hit_dice, type, monster_types,
            alignment, alignments, level, armor_class,
            description,
        } = this.props;

        return (
            <Panel
                key="description"
                className="monster-edit__description"
                header="Description"
            >
                <ControlGroup label="Campaign">
                    <SingleSelect
                        emptyLabel="Campaign..."
                        selected={campaign_id}
                        defaultValue={currentCampaign ? currentCampaign.id : null}
                        items={values(campaigns)}
                        setState={this.onFieldChange('campaign_id')}
                    />
                </ControlGroup>
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Name..."
                        value={name}
                        setState={this.onFieldChange('name')}
                    />
                </ControlGroup>
                <ControlGroup labels={["Size", "Type"]}>
                    <SingleSelect
                        emptyLabel="Size..."
                        selected={size}
                        items={size_hit_dice}
                        setState={this.onFieldChange('size')}
                    />
                    <SingleSelect
                        emptyLabel="Type..."
                        selected={type}
                        items={monster_types}
                        setState={this.onFieldChange('type')}
                    />
                </ControlGroup>
                <ControlGroup label="Alignment">
                    <SingleSelect
                        emptyLabel="Alignment..."
                        selected={alignment}
                        items={alignments}
                        setState={this.onFieldChange('alignment')}
                    />
                </ControlGroup>
                <ControlGroup label="Level">
                    <SingleSelect
                        emptyLabel="Level..."
                        selected={level}
                        items={this.levels}
                        setState={this.onFieldChange('level')}
                    />
                </ControlGroup>
                <ControlGroup label="Armor Class">
                    <SingleSelect
                        emptyLabel="Armor Class..."
                        selected={armor_class}
                        items={this.armor_classes}
                        setState={this.onFieldChange('armor_class')}
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
            </Panel>
        );
    }
}

DescriptionPanel.propTypes = {
    campaign_id: PropTypes.number,
    campaigns: PropTypes.object,
    currentCampaign: PropTypes.object,
    name: PropTypes.string,
    size: PropTypes.string,
    size_hit_dice: PropTypes.array,
    type: PropTypes.string,
    monster_types: PropTypes.array,
    alignment: PropTypes.string,
    alignments: PropTypes.array,
    level: PropTypes.number,
    armor_class: PropTypes.number,
    description: PropTypes.string,
    setState: PropTypes.func.isRequired,
};

DescriptionPanel.defaultProps = {
    campaign_id: null,
    campaigns: {},
    currentCampaign: {},
    name: '',
    size: '',
    size_hit_dice: [],
    type: '',
    monster_types: [],
    alignment: '',
    alignments: [],
    level: 1,
    armor_class: 10,
    description: '',
};

export default ListDataWrapper(
    ObjectDataListWrapper(
        ListDataWrapper(
            DescriptionPanel,
            [
                'alignments',
                'size_hit_dice',
                'monster_types',
            ],
            'items',
        ),
        { campaigns: {type: 'campaign'} }
    ),
    ['current_campaign'],
    null,
    { current_campaign: 'currentCampaign' }
);
