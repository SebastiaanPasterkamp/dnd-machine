import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

// import '../../sass/_create-character.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import {CharacterEditView} from './CharacterEdit.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import Panel from '../components/Panel.jsx';
import Progress from '../components/Progress.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import {StatsBlock} from '../components/StatsBlock.jsx';
import TabComponent from '../components/TabComponent.jsx';


export class CharacterPickAttribute extends LazyComponent
{
    tabConfig(index) {
        const { info, value } = this.props;
        const attrib = info[index];
        const active = _.find(
            attrib.sub || [attrib],
            sub => (sub.name == this.props.value)
        );

        return {
            label: attrib.name,
            color: active
                ? 'good'
                : (value == null ? 'info' : 'accent'),
            active: active
        };
    }

    renderSelector(attrib) {
        const { value, setState } = this.props;
        const subs = _.get(attrib, 'sub');

        if (!subs) {
            return <ButtonField
                label={attrib.name == value ? value : "Pick..."}
                onClick={() => setState(attrib.name)}
                />;
        }

        return <SingleSelect
            items={_.map(subs, (sub) => ({
                code: sub.name,
                label: sub.name
            }))}
            emptyLabel="Pick..."
            selected={value}
            setState={(value) => setState(value)}
            />;
    }

    render() {
        const { info } = this.props;
        if (!info) {
            return null;
        }

        return <TabComponent
            className="character-pick-attribute"
            tabConfig={(index) => this.tabConfig(index)}
            >
            {_.map(info, (attrib, index) => (
                <div key={"attrib-" + index}>
                    {this.renderSelector(attrib)}
                    <MDReactComponent
                        className="character-pick-attribute--description"
                        text={attrib.description}
                        />
                    {this.renderSelector(attrib)}
                </div>
            ))}
        </TabComponent>;
    }
}

export class CharacterCreate extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            doneInit: false,
            doneStats: false,
            doneDescr: false,
        };
    }

    onFieldChange(field, value) {
        const {
            race, 'class': _class, background, setState
        } = this.props;
        const base = _.assign(
            {},
            {race, 'class': _class, background},
            {[field]: value}
        );
        this.setState({
            doneInit: (base.race && base.class && base.background)
        }, () => setState(base));
    }

    onStatisticsChange(value) {
        let statistics = _.assign({}, this.props.statistics, value);

        this.setState(
            {
                doneStats: (
                    this.state.doneInit
                    && _.sum(_.values(statistics.bare)) >= 60
                )
            },
            () => this.props.setState({statistics})
        );
    }

    onTabChange(index) {
        this.props.recompute();
        if (index == 5) {
            this.props.setButtons(['save']);
        } else {
            this.props.setButtons([]);
        }
    }

    tabConfig(index) {
        const { race, 'class': _class, background } = this.props;
        const {
            doneInit, doneStats, doneDescr
        } = this.state;

        const tabs = [
            {
                label: race || 'Race',
                color: race ? 'good' : 'info',
            },
            {
                label: _class || 'Class',
                color: _class ? 'good' : 'info',
            },
            {
                label: background || 'Background',
                color: background ? 'good' : 'info',
            },
            {
                label: 'Statistics',
                color: doneStats ? 'good' : 'info',
                disabled: !doneInit
            },
            {
                label: 'Description',
                color: doneDescr ? 'good' : 'info',
                disabled: !doneStats
            },
            {
                label: 'Result',
                color: 'info',
                disabled: !doneDescr
            }
        ];

        return tabs[index];
    }

    render() {
        const {
            race, races, 'class': _class, classes, background,
            backgrounds, statistics, _statistics, setState, level,
            gender, genders = [], alignment, alignments = [],
            xp_progress, xp_level,
        } = this.props;
        const { doneStats } = this.state;

        return <TabComponent
                onTabChange={(index) => this.onTabChange(index)}
                tabConfig={(index) => this.tabConfig(index)}
                >
            <CharacterPickAttribute
                info={races}
                value={race}
                setState={
                    (value) => this.onFieldChange('race', value)
                }
                />
            <CharacterPickAttribute
                info={classes}
                value={_class}
                setState={
                    (value) => this.onFieldChange('class', value)
                }
                />
            <CharacterPickAttribute
                info={backgrounds}
                value={background}
                setState={
                    (value) => this.onFieldChange('background', value)
                }
                />
            <StatsBlock
                {...statistics}
                budget={27}
                maxBare={15}
                statistics={_statistics}
                setState={
                    (update) => this.onStatisticsChange(update)
                }
                />
            <CharacterEditView
                {...this.props}
                setState={(update) => {
                    this.setState(
                        {
                            doneDescr: (
                                doneStats
                                && (
                                    'name' in update
                                    ? update.name
                                    : name
                                )
                            )
                        },
                        () => setState(update)
                    );
                }}
                />
            <Panel
                header="Result"
                >
                <h3>{name}</h3>

                <h4>
                    Level {level}
                    &nbsp;
                    <ListLabel
                        items={genders}
                        value={gender}
                        />
                    &nbsp;
                    {race}
                    &nbsp;
                    {_class}
                    &nbsp;
                    (<ListLabel
                        items={alignments}
                        value={alignment}
                        />)
                </h4>

                <Progress
                    value={xp_progress}
                    total={xp_level}
                    color={"good"}
                    label={`${level} (${xp_progress} / ${xp_level})`}
                    />
            </Panel>
        </TabComponent>;
    }
}

export default ListDataWrapper(
    ListDataWrapper(
        RoutedObjectDataWrapper(
            CharacterCreate, {
                className: 'character-create',
                icon: 'fa-user-secret',
                label: 'Create Character',
            }, "character"
        ),
        ['alignments', 'genders', 'statistics'],
        'items',
        {'statistics': '_statistics'}
    ),
    ['races', 'classes', 'backgrounds'],
    'character'
);