import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

// import '../../sass/_create-character.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import {CharactersView} from './CharactersView.jsx';
import {CharacterEdit} from './CharacterEdit.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import Panel from '../components/Panel.jsx';
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
    onFieldChange(field, value) {
        let newState = {
            race: this.props.race,
            'class': this.props.class,
            background: this.props.background,
            statistics: {
                bare: this.props.statistics.bare,
            }
        };
        newState[field] = value;

        _.forEach({
            races: newState.race,
            classes: newState.class,
            backgrounds: newState.background
        }, (value, prop) => {
            const config = _.reduce(
                this.props[prop],
                (config, attrib) => {
                    const sub = _.find(attrib.sub || [], sub => {
                        return sub.name == value;
                    });

                    if (
                        attrib.name != value
                        && sub == null
                    ) {
                        return config;
                    }

                    config = _.merge(
                        {},
                        config,
                        attrib.config
                    );

                    if (sub) {
                        config = _.merge(
                            {},
                            config,
                            sub.config
                        );
                    }

                    return config;
                },
                {}
            );

            newState = _.merge(
                {},
                newState,
                config
            );

            console.log(newState);
        });

        this.props.setState(newState);
    }

    onStatisticsChange(value) {
        let update = _.assign({}, this.props.statistics, value);
        this.props.setState({
            statistics: update
        });
    }

    onTabChange(index) {
        this.props.recompute();
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
                color: 'info',
                disabled: !this.props.race
                    || !this.props.class
                    || !this.props.background
            },
            {
                label: 'Description',
                color: 'info',
                disabled: !this.props.race
                    || !this.props.class
                    || !this.props.background
            },
            {
                label: 'Result',
                color: 'info',
                disabled: !this.props.race
                    || !this.props.class
                    || !this.props.background
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
            <CharacterEdit
                {...this.props}
                />
            <CharactersView
                {...this.props}
                />
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
                buttons: ['cancel', 'recompute', 'save']
            }, "character"
        ),
        ['alignments', 'languages', 'statistics', 'skills', 'genders'],
        'items',
        {
            'languages': '_languages',
            'skills': '_skills',
            'statistics': '_statistics',
        }
    ),
    ['races', 'classes', 'backgrounds'],
    'character'
);