import {
    difference,
    forEach as forEachCapped,
    get,
    includes,
    isEqual,
    pickBy,
    reduce,
    set,
    uniq,
} from 'lodash/fp';
const forEach = forEachCapped.convert({ cap: false });

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

    let character = original;
    forEach((update, path) => {
        const current = get(path, original);
        if (!isEqual(current, update)) {
            character = set(path, update, {...character});
        }
    }, computed);

    return character;
};
