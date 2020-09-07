import {
    clone,
    countBy,
    difference,
    findIndex,
    forEach as forEachCapped,
    get,
    includes,
    isEqual,
    keys,
    pickBy,
    reduce,
    setWith,
    sum,
    uniq,
} from 'lodash/fp';
const forEach = forEachCapped.convert({ cap: false });

let errors = {};

export default function ComputeChange(changes, original) {
    const filtered = pickBy(
        (fields, id) => fields !== undefined
    )(changes);

    let statisticsChanged = [];
    const computed = reduce(
        (computed, {option, choice}) => {

            if (option.conditions
                && !MatchesFilters(original, option.conditions)
            ) {
                return computed;
            }

            if (option.type === 'permanent') {
                const {
                    permanent: current = get('permanent', original) || [],
                } = computed;
                computed.permanent = {
                    ...current,
                    ...option.config,
                };
                return computed;
            }

            if (option.type === 'dict') {
                const {
                    [option.path]: current = get(option.path, original) || {},
                } = computed;
                computed[option.path] = {
                    ...current,
                    ...option.dict,
                };
                return computed;
            }

            if (includes(option.type, ['leveling', 'list'])) {
                const {
                    [option.path]: current = get(option.path, original) || [],
                } = computed;
                const { added = [], removed = [] } = choice || {};
                const { given = [] } = option;
                let update = difference(current, removed);
                update = [...update, ...given, ...added];
                if (!option.multiple) {
                    update = uniq(update);
                }
                computed[option.path] = update;
                return computed;
            }

            if (option.type === 'objectlist') {
                const { path, given = [], multiple = false } = option;
                const { added = [], removed = [] } = choice || {};
                const {
                    [path]: current = get(path, original) || [],
                } = computed;

                computed[path] = current;

                computed[path] = reduce(
                    (update, {type, id, count = 1}) => {
                        const idx = findIndex({ type, id }, update);
                        if (idx < 0) {
                            if (!errors[option.uuid]) {
                                errors[option.uuid] = true;
                                console.error("Cannot reduce item", {update, item: {type, id, count}, uuid: option.uuid});
                            }
                            return update;
                        }

                        if (!multiple || count >= (update[idx].count || 1)) {
                            console.assert(count <= (update[idx].count || 1), "Reduced items below 0", update, {type, id, count});
                            return [
                                ...update.slice(0, idx),
                                ...update.slice(idx + 1),
                            ];
                        }

                        return [
                            ...update.slice(0, idx),
                            {...update[idx], ...item, count: (update[idx].count || 1) - count},
                            ...update.slice(idx + 1),
                        ];
                    },
                    computed[path]
                )(removed);

                computed[option.path] = reduce(
                    (update, item) => {
                        const { type, id, count = 1 } = item;
                        const idx = findIndex({ type, id }, update);
                        if (idx < 0) {
                            return [...update, item];
                        }

                        if (!multiple) {
                            // Not adding duplicates
                            return update;
                        }

                        return [
                            ...update.slice(0, idx),
                            {...update[idx], ...item, count: (update[idx].count || 1) + count},
                            ...update.slice(idx + 1),
                        ];
                    },
                    computed[option.path]
                )([...added, ...given]);

                return computed;
            }

            if (includes(option.type, ['manual', 'select'])) {
                if (choice) {
                    computed[option.path] = choice.current;
                }
                return computed;
            }

            if (option.type === 'ability_score') {
                if (!choice) {
                    return computed;
                }
                const bonus = countBy(i => i)(choice.improvement);
                forEach(
                    (value, stat) => {
                        const path = `statistics.bonus.${stat}`;
                        const {
                            [path]: current = get(path, original) || [],
                        } = computed;
                        computed[path] = [...current, value];
                        statisticsChanged.push(stat);
                    }
                )(bonus);
                return computed;
            }

            if (option.type === 'statistics') {
                if (!choice || !choice.bare) {
                    return computed;
                }
                const {
                    ['statistics.bare']: current = get('statistics.bare', original) || {},
                } = computed;
                computed['statistics.bare'] = {
                    ...current,
                    ...choice.bare,
                };
                statisticsChanged = [...statisticsChanged, ...keys(choice.bare)];
                return computed;
            }

            if (option.type === 'value') {
                computed[option.path] = option.value;
                return computed;
            }

            throw `Unknown option type: '${option.type} ${option.uuid}'`;
        },
        {}
    )(filtered);

    let character = original;
    forEach((update, path) => {
        const current = get(path, original);
        if (!isEqual(current, update)) {
            character = setWith(clone, path, update, clone(character));
        }
    }, computed);

    if (statisticsChanged.length) {
        const statistics = uniq(statisticsChanged);

        let {
            bare = {},
            bonus = {},
            base = {},
            modifiers = {},
        } = character.statistics;

        forEach(
            stat => {
                bare = {
                    ...bare,
                    [stat]: bare[stat] || 8,
                };
                bonus = {
                    ...bonus,
                    [stat]: bonus[stat] || [],
                }
                base = {
                    ...base,
                    [stat]: bare[stat] + sum(bonus[stat]),
                };
                modifiers = {
                    ...modifiers,
                    [stat]: Math.floor((base[stat] - 10) / 2),
                };
            }
        )(statistics);

        character.statistics = {
            ...character.statistics,
            bare,
            bonus,
            base,
            modifiers,
        };
    }

    return character;
};
