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
import StatsBlock from '../components/StatsBlock.jsx';
import TabComponent from '../components/TabComponent.jsx';


export class CharacterPickAttribute extends LazyComponent
{
    tabConfig(index) {
        const attrib = this.props.info[index];
        const active = _.find(attrib.sub || [attrib], sub => {
            return sub.name == this.props.value
        });

        return {
            label: attrib.name,
            color: active
                ? 'good'
                : (this.props.value == null ? 'info' : 'accent'),
            active: active
        };
    }

    renderSelector(attrib) {
        const subs = _.get(attrib, 'sub');

        if (!subs) {
            return <ButtonField
                label={
                    attrib.name == this.props.value
                    ? this.props.value
                    : "Pick..."
                }
                onClick={() => {
                    this.props.setState(attrib.name);
                }}
                />;
        }

        return <SingleSelect
            items={_.map(subs, (sub) => {
                return {
                    code: sub.name,
                    label: sub.name
                };
            })}
            emptyLabel="Pick..."
            selected={this.props.value}
            setState={(value) => {
                this.props.setState(value);
            }}
            />;
    }

    render() {
        if (!('info' in this.props)) {
            return null;
        }

        return <TabComponent
                tabConfig={(index) => this.tabConfig(index)}
                >
            {_.map(this.props.info, (attrib, index) => {
                return <div key={"attrib-" + index}>
                    {this.renderSelector(attrib)}
                    <MDReactComponent text={attrib.description} />
                    {this.renderSelector(attrib)}
                </div>;
            })}
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
        const base = _.assign(
            {},
            {
                race: this.props.race,
                'class': this.props.class,
                background: this.props.background,
            },
            {[field]: value}
        );
        this.setState({
            doneInit: (
                base.race
                && base.class
                && base.background
            )
        }, () => {
            this.props.setState(base)
        });
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
        const tabs = [
            {
                label: this.props.race || 'Race',
                color: this.props.race ? 'good' : 'info',
            },
            {
                label: this.props.class || 'Class',
                color: this.props.class ? 'good' : 'info',
            },
            {
                label: this.props.background || 'Background',
                color: this.props.background ? 'good' : 'info',
            },
            {
                label: 'Statistics',
                color: this.state.doneStats ? 'good' : 'info',
                disabled: !this.state.doneInit
            },
            {
                label: 'Description',
                color: this.state.doneDescr ? 'good' : 'info',
                disabled: !this.state.doneStats
            },
            {
                label: 'Result',
                color: 'info',
                disabled: !this.state.doneDescr
            }
        ];

        return tabs[index];
    }

    render() {
        return <TabComponent
                onTabChange={(index) => this.onTabChange(index)}
                tabConfig={(index) => this.tabConfig(index)}
                >
            <CharacterPickAttribute
                info={this.props.races}
                value={this.props.race}
                setState={(value) => {
                    this.onFieldChange('race', value);
                }}
                />
            <CharacterPickAttribute
                info={this.props.classes}
                value={this.props.class}
                setState={(value) => {
                    this.onFieldChange('class', value);
                }}
                />
            <CharacterPickAttribute
                info={this.props.backgrounds}
                value={this.props.background}
                setState={(value) => {
                    this.onFieldChange('background', value);
                }}
                />
            <StatsBlock
                {...this.props.statistics}
                budget={27}
                maxBare={16}
                setState={
                    (update) => this.onStatisticsChange(update)
                } />
            <CharacterEditView
                {...this.props}
                setState={(update) => {
                    this.setState(
                        {
                            doneDescr: (
                                this.state.doneStats
                                && update.name
                            )
                        },
                        () => this.props.setState(update)
                    );
                }}
                />
            <Panel
                header="Result"
                >
                <h3>{this.props.name}</h3>

                <h4>
                    Level {this.props.level}
                    &nbsp;
                    <ListLabel
                        items={this.props.genders}
                        value={this.props.gender}
                        />
                    &nbsp;
                    {this.props.race}
                    &nbsp;
                    {this.props.class}
                    &nbsp;
                    (<ListLabel
                        items={this.props.alignments}
                        value={this.props.alignment}
                        />)
                </h4>

                <Progress
                    value={this.props.xp_progress}
                    total={this.props.xp_level}
                    color={"good"}
                    label={
                        this.props.level
                        + ' ('
                        + this.props.xp_progress
                        + " / "
                        + this.props.xp_level
                        + ')'
                    }
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