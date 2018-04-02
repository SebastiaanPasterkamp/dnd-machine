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
    'spell',
    'statistics',
    'tools',
    'weapon_types',
    'weapon',
    'armor_types',
    'armor'
];
const propsMap = {
    'armor': '_armor',
    'languages': '_languages',
    'skills': '_skills',
    'spell': '_spells',
    'statistics': '_statistics',
    'weapon': '_weapons',
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
            undefined
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
            undefined
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


class SelectPropertySelect extends LazyComponent
{
    componentWillUnmount() {
        this.props.onChange(
            this.props.path,
            undefined
        );
    }

    onChange(value) {
        this.props.onChange(
            this.props.path,
            value
        );
    }

    render() {
        if (this.props.hidden) {
            return null;
        }

        return <SingleSelect
            className="small"
            items={this.props.items}
            setState={(value) => this.onChange(value)}
            selected={this.props.current}
            emptyLabel="Please select"
            />;
    }
};

SelectPropertySelect.propTypes = {
    path: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    value: PropTypes.any,
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
            undefined
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
            undefined
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
    items: PropTypes.arrayOf(PropTypes.object),
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


class MultipleChoiceSelect extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            used: [],
            removed: []
        };
    }

    componentWillUnmount() {
        _.forEach(
            this.state.replace,
            path => this.props.onChange(path, undefined)
        );
    }

    onAdd(value) {
        const limit = this.props.limit
                    + this.state.removed.length;
        if (_.includes(this.state.removed, value)) {
            let removed = _.without(this.state.used, value);
            this.setState({removed}, () => {
                this.props.onChange(value, undefined)
            });
        } else if (this.state.used.length < limit) {
            let used = _.union(this.state.used, [value]);
            this.setState({used});
        }
    }

    onDelete(key, value) {
        const limit = this.props.replace;
        if (_.includes(this.state.used, value)) {
            let used = _.without(this.state.used, value);
            this.setState({used});
        } else if (this.state.removed.length < limit) {
            let removed = _.union(this.state.removed, [value]);
            this.setState({removed}, () => {
                this.props.onChange(value, null)
            });
        }
    }

    renderTags() {
        const {getCurrent, limit, replace} = this.props;
        const {used, removed} = this.state;
        const showSelect = used.length < limit;
        const currentImmutable = removed.length >= replace;
        const current = _.reduce(
            this.props.options,
            (current, option) => {
                if (getCurrent(option.path)) {
                    current.push(option.path);
                }
                return current;
            },
            []
        );
        const tagOptions = _.map(this.props.options, option => {
            const isNew = _.includes(used, option.path);
            return {
                code: option.path,
                label: option.label,
                immutable: currentImmutable && !isNew,
                color: isNew ? 'info' : 'warning'
            };
        });

        return <TagContainer
            tags={current}
            tagOptions={tagOptions}
            onAdd={(value) => this.onAdd(value)}
            onDelete={(key, value) => this.onDelete(key, value)}
            onChange={() => { return null; }}
            showSelect={showSelect}
            />;
    }

    render() {
        const {used, removed} = this.state;
        const changes = _.union(used, removed);

        return <div>
            {this.renderTags()}
            {_.map(this.props.options, (option, index) => {
                if (!_.includes(changes, option.path)) {
                    return null;
                }
                const props = {
                    index: this.props.index.concat([index]),
                    getCurrent: this.props.getCurrent,
                    getItems: this.props.getItems,
                    onChange: this.props.onChange,
                    config: [option],
                    disabled: _.includes(removed, option.path)
                };

                return <CharacterConfig
                    key={index}
                    {...props}
                    />;
            })}
        </div>;
    }
};

MultipleChoiceSelect.defaultTypes = {
    replace: 0
};

MultipleChoiceSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    getCurrent: PropTypes.func.isRequired,
    getItems: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    description: PropTypes.string,
    limit: PropTypes.number.isRequired,
    replace: PropTypes.number,
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
            multichoice: MultipleChoiceSelect,
            select: SelectPropertySelect,
            value: ValuePropertySelect,
        };
    }

    render() {
        const {
            config, onChange, getCurrent, getItems
        } = this.props;

        return <div>
            {_.map(config, (option, index) => {
                const ConfigComponent = this.components[option.type];

                if (ConfigComponent == undefined) {
                    console.log(option);
                    return null;
                }

                const props = {
                    index: this.props.index.concat([index]),
                };
                props.onChange = (
                    path, value, idx=null, opt=null
                ) => onChange(
                    path,
                    value,
                    idx || props.index,
                    opt || option,
                );

                if (_.includes(
                    ['choice', 'config', 'multichoice'],
                    option.type
                )) {
                    props.getCurrent = getCurrent;
                    props.getItems = getItems;
                }

                if ('list' in option) {
                    props.items = getItems(option.list);
                } else if ('items' in option) {
                    if (_.isArray(option.items)) {
                        props.items = _.map(option.items, i => ({
                            code: i,
                            label: i
                        }));
                    } else {
                        props.items = option.items;
                    }
                }
                if ('path' in option) {
                    props.current = getCurrent(option.path);
                }

                if (option.label) {
                    return <FormGroup
                            label={option.label}
                            key={index}
                            >
                        <ConfigComponent
                            {...option}
                            {...props}
                            />
                    </FormGroup>;
                }

                return <ConfigComponent
                        key={index}
                        {...option}
                        {...props}
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
                    if (_.isNil(change.props[root])) {
                        change.props[root] = _.cloneDeep(
                            this.props.character[root]
                        );
                    }
                    if (value == undefined) {
                        return change;
                    }

                    const current = _.get(
                        change.props,
                        path
                    );
                    let update = null;

                    if (
                        value == null
                        || _.includes(
                            ['value', 'select'],
                            option.type
                        )
                    ) {
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
                        if (!(option.multiple || false)) {
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
        const {
            character, level_up, statistics, _statistics
        } = this.props;

        if (
            !character
            || !level_up.creation.length
        ) {
            return null;
        }

        let statsBlock = {
            increase: this.state.abilityScore,
            editBase: false,
        };
        if (!character.creation.length) {
            statsBlock.editBase = true;
            statsBlock.budget = 27;
            statsBlock.maxBare = 15;
        }

        return [
            <Panel
                    key="level-up"
                    className="character-level__level-up"
                    header="Level-up"
                >
                <CharacterConfig
                    config={level_up.config}
                    index={[]}
                    getCurrent={(path) => _.get(this.props, path)}
                    getItems={(lists) => this.getItems(lists)}
                    onChange={(path, value, index, option) => {
                        this.onChange(path, value, index, option)
                    }}
                    />
            </Panel>,

            statsBlock.increase || statsBlock.editBase ? <Panel
                    key="statistics"
                    className="character-level__statistics"
                    header="Ability Score"
                >
                <StatsBlock
                    {...statistics}
                    statistics={_statistics}
                    {...statsBlock}
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
