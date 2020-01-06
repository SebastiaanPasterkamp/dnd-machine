import React from 'react';
import PropTypes from 'prop-types';
import {
    filter,
    forEach,
    includes,
    intersection,
    isEqual,
    keys,
    map,
    max,
    pull,
    range,
    reduce,
    values,
} from 'lodash/fp';

import './sass/_monster-edit.scss';

import { memoize } from '../../utils';

import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import Panel from '../../components/Panel';
import StatsBlock from '../../components/StatsBlock';
import { ListComponent } from '../../components/ListComponent';

import AttackEditor from './components/AttackEditor';
import DescriptionPanel from './components/DescriptionPanel';
import MultiAttackEditor from './components/MultiAttackEditor';
import PropertiesPanel from './components/PropertiesPanel';

export class MonsterEdit extends React.Component
{
    constructor(props) {
        super(props);

        this.affects_rating = [
            'level',
            'armor_class',
            'attacks',
            'multiattack',
            'statistics',
        ];
        this.memoize = memoize.bind(this);
        this.onSetState = this.onSetState.bind(this);
        this.onAttackChange = this.onAttackChange.bind(this);
        this.onStatisticsChange = this.onStatisticsChange.bind(this);
    }

    onSetState(update) {
        const { setState, recompute } = this.props;
        setState(update, () => {
            if (intersection(
                keys(update),
                this.affects_rating
            ).length) {
                recompute();
            }
        });
    }

    onFieldChange(field) {
        return this.memoize(
            field,
            (value) => this.onSetState({ [field]: value })
        );
    }

    onAttackChange(after) {
        const { attacks: before, multiattack } = this.props;
        const newState = { attacks: after };

        // New attack; nothing to rename
        if (after.length > before.length) {
            this.onSetState(newState);
            return;
        }

        const rename = after.length < before.length
            // deletion
            ? reduce(
                (rename, j) => {
                    const i = before.length - j - 1;
                    if (i >= after.length || before[i].name != after[i].name) {
                        rename = { [before[i].name]: null };
                    }
                    return rename;
                }, {}
            )(range(0, before.length))
            // rename
            : reduce(
                (rename, i) => {
                    if (before[i].name != after[i].name) {
                        rename[ before[i].name ] = after[i].name;
                    }
                    return rename;
                }, {}
            )(range(0, after.length));

        if (!keys(rename).length) {
            this.onSetState(newState);
            return;
        }

        let changed = false;
        const mas = map((ma) => {
            if (!intersection(keys(rename), ma.sequence)) {
                return ma;
            }
            changed = true;
            return {
                ...ma,
                sequence: filter(null, map(attack => (attack in rename ? rename[attack] : attack))(ma.sequence)),
            };
        })(multiattack);

        if (changed) {
            newState.multiattack = mas;
        }

        this.onSetState(newState);
    }

    onStatisticsChange(update) {
        const { statistics } = this.props;
        this.onFieldChange('statistics')({
            ...statistics,
            ...update,
        });
    }

    render() {
        const {
            name, size, type, alignment, level, armor_class,
            description, challenge_rating_precise, xp_rating,
            motion, languages, traits, statistics, attacks,
            multiattack, campaign_id,
        } = this.props;

        const descProps = {
            campaign_id, name, size, type, alignment, level, armor_class,
            description, setState: this.onSetState,
        };
        const propProps = {
            challenge_rating_precise, xp_rating, motion, languages, traits,
            setState: this.onSetState,
        };

        return <React.Fragment>
            <DescriptionPanel {...descProps} />

            <PropertiesPanel {...propProps} />

            <Panel
                key="statistics"
                className="monster-edit__statistics"
                header="Statistics"
            >
                <StatsBlock
                    {...statistics}
                    minBare={1}
                    setState={this.onStatisticsChange}
                />
            </Panel>

            <Panel
                key="attacks"
                className="monster-edit__attacks"
                header="Attacks"
            >
                <ListComponent
                    component={AttackEditor}
                    list={attacks}
                    newItem="initial"
                    setState={this.onAttackChange}
                />
            </Panel>

            <Panel
                key="multiattack"
                className="monster-edit__multiattacks"
                header="Multi Attack"
            >
                <ListComponent
                    component={MultiAttackEditor}
                    list={multiattack}
                    newItem="initial"
                    componentProps={{attacks}}
                    setState={this.onFieldChange('multiattack')}
                />
            </Panel>
        </React.Fragment>
    }
}

MonsterEdit.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    campaign_id: PropTypes.number,
    campaigns: PropTypes.object,
    size: PropTypes.string,
    size_hit_dice: PropTypes.array,
    type: PropTypes.string,
    monster_types: PropTypes.array,
    alignment: PropTypes.string,
    alignments: PropTypes.array,
    level: PropTypes.number,
    armor_class: PropTypes.number,
    description: PropTypes.string,
    challenge_rating_precise: PropTypes.number,
    xp_rating: PropTypes.number,
    motion: PropTypes.object,
    languages: PropTypes.array,
    _languages: PropTypes.array,
    traits: PropTypes.object,
    statistics: PropTypes.object,
    attacks: PropTypes.array,
    multiattack: PropTypes.array,
    setState: PropTypes.func.isRequired,
    recompute: PropTypes.func,
};

MonsterEdit.defaultProps = {
    id: null,
    campaign_id: null,
    campaigns: {},
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
    challenge_rating_precise: 0.0,
    xp_rating: 0,
    motion: {},
    languages: [],
    _languages: [],
    traits: {},
    statistics: {},
    attacks: [],
    multiattack: [],
    recompute: null,
};

export default RoutedObjectDataWrapper(
    MonsterEdit, {
        className: 'monster-edit',
        icon: 'fa-paw',
        label: 'Monster',
        buttons: ['cancel', 'reload', 'recompute', 'save']
    }, "monster"
);
