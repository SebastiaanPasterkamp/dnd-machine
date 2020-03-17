import {
    clone,
    difference,
    findIndex,
    forEach as forEachCapped,
    get,
    includes,
    isEqual,
    pickBy,
    reduce,
    setWith,
    uniq,
} from 'lodash/fp';
const forEach = forEachCapped.convert({ cap: false });

let errors = {};

export default function ComputeChange(changes, original) {
    const filtered = pickBy(
        (fields, id) => fields !== undefined
    )(changes);

    const computed = reduce(
        (computed, {option, choice}) => {

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

            if (option.type === 'list') {
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
                forEach(
                    stat => {
                        const path = `statistics.bonus.${stat}`;
                        const {
                            [path]: current = get(path, original) || [],
                        } = computed;
                        computed[path] = [...current, 1];
                    }
                )(choice.improvement);
                return computed;
            }

            if (option.type === 'statistics') {
                if (!choice) {
                    return computed;
                }
                const {
                    ['statistics.bare']: current = get('statistics.bare', original) || {},
                } = computed;
                computed['statistics.bare'] = {
                    ...current,
                    ...choice.bare,
                };
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

    let character = original;1
    forEach((update, path) => {
        const current = get(path, original);
        if (!isEqual(current, update)) {
            character = setWith(clone, path, update, clone(character));
        }
    }, computed);

    return character;
};
