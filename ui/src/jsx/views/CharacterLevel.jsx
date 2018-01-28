import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';
import {sprintf} from 'sprintf-js';

import '../../sass/_level-character.scss';

import BaseViewWrapper from '../hocs/BaseViewWrapper.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import BaseTagContainer from '../components/BaseTagContainer.jsx';
import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import FormGroup from '../components/FormGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import Progress from '../components/Progress.jsx';
import SingleSelect from '../components/SingleSelect.jsx';
import {StatsBlock} from '../components/StatsBlock.jsx';
import TabComponent from '../components/TabComponent.jsx';
import TagContainer from '../components/TagContainer.jsx';

const viewConfig = {
    className: 'character-level',
    icon: 'fa-level-up',
    label: 'Level-up',
    buttons: ['cancel', 'reload', 'save']
};

const propsList = [
    'languages',
    'skills',
    'spells',
    'statistics',
    'tools',
    'weapon_types',
    'weapons',
    'armor_types',
    'armor'
];
const propsMap = {
    'languages': '_languages',
    'skills': '_skills',
    'spells': '_spells',
    'statistics': '_statistics',
    'weapons': '_weapons',
};

class AbilityScoreSelect extends LazyComponent
{
    componentDidMount() {
        this.props.onChange(
            null,
            this.props.limit
        );
    }

    componentWillUnmount() {
        this.props.onChange(
            null,
            null
        );
    }

    render() {
        return null;
    }
};

AbilityScoreSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    limit: PropTypes.number.isRequired,
};

class ValuePropertySelect extends LazyComponent
{
    componentDidMount() {
        this.props.onChange(
            this.props.path,
            this.props.value
        );
    }

    componentWillUnmount() {
        this.props.onChange(
            this.props.path,
            null
        );
    }

    render() {
        if (this.props.hidden) {
            return null;
        }

        return <MarkdownTextField
            className="small"
            disabled={true}
            value={(this.props.value || '').toString()}
            />;
    }
};

ValuePropertySelect.propTypes = {
    path: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
    hidden: PropTypes.bool,
};


class DictPropertySelect extends LazyComponent
{
    componentDidMount() {
        this.props.onChange(
            this.props.path,
            this.props.dict
        );
    }

    componentWillUnmount() {
        this.props.onChange(
            this.props.path,
            null
        );
    }

    render() {
        if (this.props.hidden) {
            return null;
        }

        const dict = _.assign(
            {},
            this.props.current,
            this.props.dict
        );

        return <MarkdownTextField
            className="small"
            disabled={true}
            value={sprintf(dict.description, dict)}
            />;
    }
};

DictPropertySelect.propTypes = {
    path: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    current: PropTypes.object,
    hidden: PropTypes.bool,
};


class ListPropertySelect extends BaseTagContainer
{
    constructor(props) {
        super(props);
        this.state = {
            value: []
        };
    }

    componentDidMount() {
        this.props.onChange(
            this.props.path,
            this.props.given || []
        );
    }

    componentWillUnmount() {
        this.props.onChange(
            this.props.path,
            null
        );
    }

    isDisabled(item) {
        if (this.props.multiple == true) {
            return false;
        }
        const value = item.code || item.name;
        if (_.includes(this.props.current, value)) {
            return true;
        }
        if (_.includes(this.props.given, value)) {
            return true;
        }
        if (_.includes(this.state.value, value)) {
            return true;
        }
        return false;
    }

    _setState(value) {
        this.setState(
            {value},
            () => this.props.onChange(
                this.props.path,
                this.state.value.concat(
                    this.props.given || []
                )
            )
        );
    }

    onChange(key, value) {
        let head = _.take(
            this.state.value,
            key
        );
        let tail = _.takeRight(
            this.state.value,
            this.state.value.length - key - 1
        );
        this._setState(
            head.concat([value]).concat(tail)
        );
    }

    onDelete(key, value) {
        let head = _.take(
            this.state.value,
            key
        );
        let tail = _.takeRight(
            this.state.value,
            this.state.value.length - key - 1
        );
        this._setState(
            head.concat(tail)
        );
    }

    onAdd(value) {
        let head = _.take(
            this.state.value,
            this.state.value.length
        );
        this._setState(
            head.concat([value])
        );
    }

    getItem(key, value) {
        return value;
    }

    findItem(value, _default={label: value, color: 'bad'}) {
        return _.find(this.props.items, {code: value})
            || _.find(this.props.items, {name: value})
            || _default;
    }

    getTags() {
        let tags = _.map(
            this.state.value,
            (code) => {
                return this.findItem(code);
            }
        ).concat( _.map(
            this.props.given,
            (code) => {
                return _.assign(
                    {},
                    this.findItem(code),
                    {
                        color: 'info',
                        immutable: true,
                    }
                );
            }
        ) );

        let upgrade = _.countBy(tags, (item) => {
            return item.code || item.name;
        });

        return tags.concat( _.filter( _.map(
            this.props.current,
            (code) => {
                if (upgrade[code] || 0) {
                    upgrade[code] -= 1;
                    return null;
                }
                const current = this.findItem(code, null);
                if (!current) {
                    return null;
                }
                return _.assign(
                    {},
                    current,
                    {
                        immutable: true,
                    }
                );
            }
        ) ) );
    }

    showSelect() {
        if ((this.props.limit || 0) - this.state.value.length) {
            return true;
        }
        return false;
    }

    getSelectOptions() {
        if (!this.props.limit) {
            return [];
        }

        if (!this.props.filter) {
            return this.props.items;
        }

        const filter = _.reduce(
            this.props.filter,
            (filter, cond, path) => {
                filter[path] = _.isArray(cond) ? cond : [cond];
                return filter;
            },
            {}
        );

        const filtered = _.filter(
            this.props.items,
            (item) => _.every(
                filter,
                (cond, path) => {
                    const value = _.get(item, path);
                    return _.intersection(
                        _.isArray(value) ? value : [value],
                        cond
                    ).length;
                }
            )
        );
        return filtered;
    }

    render() {
        if (this.props.hidden) {
            return null;
        }

        return super.render.call(this);
    }

};

ListPropertySelect.propTypes = {
    path: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    given: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    ),
    current: PropTypes.array,
    limit: PropTypes.number,
    filter: PropTypes.object,
    multiple: PropTypes.bool,
    hidden: PropTypes.bool,
};


class ChoiceSelect extends LazyComponent
{
    constructor(props) {
        super(props);
    }

    render() {
        return <TabComponent
                tabConfig={this.props.options}
                >
            {_.map(this.props.options, (option, index) => {
                const props = {
                    index: this.props.index.concat([index]),
                    getCurrent: this.props.getCurrent,
                    getItems: this.props.getItems,
                    onChange: this.props.onChange,
                    config: option.config
                };

                return <div key={index}>
                    {option.description
                        ? <MDReactComponent
                            text={option.description}
                            />
                        : null
                    }
                    <CharacterConfig
                        {...props}
                        />
                </div>;
            })}
        </TabComponent>;
    }
};

ChoiceSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    getCurrent: PropTypes.func.isRequired,
    getItems: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    description: PropTypes.string,
};


class CharacterConfig extends LazyComponent
{
    constructor(props) {
        super(props);
        this.components = {
            ability_score: AbilityScoreSelect,
            choice: ChoiceSelect,
            config: CharacterConfig,
            dict: DictPropertySelect,
            list: ListPropertySelect,
            value: ValuePropertySelect,
        };
    }

    render() {
        return <div>
            {_.map(this.props.config, (option, index) => {
                const ConfigComponent = this.components[option.type];

                if (ConfigComponent == undefined) {
                    console.log(option);
                    return null;
                }

                const props = {
                    index: this.props.index.concat([index]),
                    getCurrent: this.props.getCurrent,
                    getItems: this.props.getItems,
                    onChange: (path, value, idx=null, opt=null) => {
                        this.props.onChange(
                            path,
                            value,
                            idx || this.props.index.concat([index]),
                            opt || option,
                        );
                    },
                };

                if (option.type == 'list') {
                    props.items = props.getItems(option.list);
                }
                if ('path' in option) {
                    props.current = props.getCurrent(option.path);
                }

                if (option.label) {
                    return <FormGroup
                            label={option.label}
                            key={index}
                            >
                        <ConfigComponent
                            key={index}
                            {...props}
                            {...option}
                            />
                    </FormGroup>;
                }

                return <ConfigComponent
                        key={index}
                        {...props}
                        {...option}
                        />;
            })}
        </div>
    }
};

CharacterConfig.propTypes = {
    onChange: PropTypes.func.isRequired,
    index: PropTypes.arrayOf(PropTypes.number).isRequired,
    getCurrent: PropTypes.func.isRequired,
    getItems: PropTypes.func.isRequired,
    config: PropTypes.arrayOf(PropTypes.object).isRequired,
};


export class CharacterLevel extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            abilityScore: 0,
        };

        this.computeProps = _.debounce(() => {
            const change = _.reduce(
                this.state,
                (change, {path, value, option}) => {
                    if (_.isNil(option)) {
                        return change;
                    }

                    if (option.type == 'ability_score') {
                        change.state.abilityScore = (
                            change.state.abilityScore || 0
                        ) + (value || 0);
                        return change;
                    }

                    const root = _.split(path, '.')[0];
                    if (value == null) {
                        if (!(root in change.props)) {
                            change.props[root] = undefined;
                        }
                        return change;
                    }

                    if (_.isNil(change.props[root])) {
                        change.props[root] = _.cloneDeep(
                            this.props.character[root]
                        );
                    }

                    const current = _.get(
                        change.props,
                        path
                    );
                    let update = null;

                    if (option.type == 'value') {
                        update = value;
                    } else if (option.type == 'dict') {
                        update = _.assign(
                            {},
                            current || {},
                            value
                        );
                    } else if (option.type == 'list') {
                        update = (current || []).concat(
                            value
                        );
                        if (!(option.duplicates || false)) {
                            update = _.uniq(update);
                        }
                    } else {
                        console.log([
                            "Unknown option type",
                            option
                        ]);
                    }

                    change.props = _.set(
                        change.props,
                        path,
                        update
                    );

                    return change;
                },
                {props: {}, state: {}}
            );

            console.log(change);

            if (!_.isEqual(change.state, {})) {
                this.setState(
                    change.state,
                    () => {
                        this.props.setState(change.props);
                    }
                );
            } else {
                this.props.setState(change.props);
            }
        }, 10);
    }

    getItems(lists) {
        if (!_.isArray(lists)) {
            lists = [lists];
        }

        return _.reduce(
            lists,
            (items, item) => {
                return items.concat(
                    this.props[
                        propsMap[item] || item
                    ] || []
                );
            },
            []
        );
    }

    onChange(path, value, index, option) {
        this.setState(
            {
                [index.join('.')]: {path, value, option}
            },
            () => this.computeProps()
        );
    }

    render() {
        if (
            !this.props.character
            || !this.props.level_up.creation.length
        ) {
            return null;
        }

        return [
            <Panel
                    key="level-up"
                    className="character-level__level-up"
                    header="Level-up"
                >
                <CharacterConfig
                    config={this.props.level_up.config}
                    index={[]}
                    getCurrent={(path) => _.get(this.props, path)}
                    getItems={(lists) => this.getItems(lists)}
                    onChange={(path, value, index, option) => {
                        this.onChange(path, value, index, option)
                    }}
                    />
            </Panel>,

            this.state.abilityScore ? <Panel
                    key="statistics"
                    className="character-level__statistics"
                    header="Ability Score increase"
                >
                <StatsBlock
                    {...this.props.statistics}
                    statistics={this.props._statistics}
                    increase={this.state.abilityScore}
                    editBase={false}
                    setState={(statistics) => {
                        this.onChange(
                            'statistics.bare',
                            statistics.bare,
                            ['statistics','bare'],
                            {type: 'dict'}
                        );
                        this.onChange(
                            'statistics.base',
                            statistics.base,
                            ['statistics','base'],
                            {type: 'dict'}
                        );
                        this.onChange(
                            'statistics.modifiers',
                            statistics.modifiers,
                            ['statistics','modifiers'],
                            {type: 'dict'}
                        );
                    }}
                    />
            </Panel> : null
        ];
    }
};

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        ObjectDataWrapper(
            CharacterLevel,
            [{type: 'character', id: 'id'}]
        ), viewConfig, "character"
    ),
    propsList,
    'items',
    propsMap
);
