import {
    concat,
    difference,
    forEach as forEachCapped,
    get,
    includes,
    isEqual,
    isObject,
    isPlainObject,
    keys,
    map,
    pickBy,
    reduce,
    replace,
    set,
    uniq,
} from 'lodash/fp';
const forEach = forEachCapped.convert({ cap: false });

import utils from '../../utils.jsx';

export function ComputeChange(changes, original) {
    const filtered = pickBy(
        (fields, id) => fields !== undefined
    )(changes);

    const computed = reduce(
        (computed, {path, value, option}) => {
            let update = null;

            if (value === undefined) {
                return computed;
            }

            if (
                value === null
                || includes(option.type,['value', 'select', 'manual'])
            ) {
                update = value;
            } else if (option.type == 'dict') {
                const {
                    [path]: current = get(path, original) || {},
                } = computed;
                update = {
                    ...current,
                    ...value,
                };
            } else if (option.type == 'list') {
                const {
                    [path]: current = get(path, original) || [],
                } = computed;
                update = difference(current, value.removed);
                update = concat(update, value.added);
                if (!option.multiple) {
                    update = uniq(update);
                }
            } else {
                throw "Unknown option type: " + JSON.stringify(option);
            }

            computed[path] = update;
            return computed;
        },
        {}
    )(filtered);

    let character = original;
    forEach((update, path) => {
        const current = get(path, original);
        if (!isEqual(current, update)) {
            character = {...character}
            character = set(path, update, {...character});
        }
    }, computed);

    return character;
};

export function ComputeConfig(config, character) {
    if (isPlainObject(config)) {
        let changed = false;
        const newConfig = reduce(
            (newConfig, key) => {
                newConfig[key] = config[key];
                if (key.match(/_formula$/)) {
                    const root = replace(/_formula$/, '', key);
                    newConfig[root] = config[root];
                    let newValue = undefined;
                    try {
                        newValue = utils.resolveMath(
                            character,
                            config[key],
                            'character'
                        );
                    } catch(error) {
                        newValue = undefined;
                    }
                    if (newValue === undefined) {
                        newValue = config[`${root}_default`];
                    }
                    if (!isEqual(newValue, newConfig[root])) {
                        changed = true;
                        newConfig[root] = newValue;
                    }
                } else {
                    const newValue = ComputeConfig(
                        config[key],
                        character
                    );
                    if (newValue !== newConfig[key]) {
                        changed = true;
                        newConfig[key] = newValue;
                    }
                }
                return newConfig;
            },
            {}
        )(keys(config));
        if (changed) {
            return newConfig;
        }
    } else if (isObject(config)) {
        let changed = false;
        const newConfig = map((value) => {
            const newValue = ComputeConfig(value, character);
            if (newValue !== value) {
                changed = true;
                return newValue;
            }
            return value;
        })(config);
        if (changed) {
            return newConfig;
        }
    }
    return config;
};
