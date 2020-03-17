import {
    includes,
    find,
    reduce,
} from 'lodash/fp';

export default function CollectChanges(config, choices, path) {
    return reduce(
        ({record, changes}, option) => {
            const { type, uuid } = option;
            const { [uuid]: choice } = choices;

            if (includes(
                type,
                ['value', 'dict', 'list', 'objectlist', 'select', 'manual', 'ability_score', 'statistics']
            )) {
                if (path && option.path !== path) {
                    return { record, changes };
                }

                changes.push({ option, choice });
                record[uuid] = choice || true;
                return { record, changes };
            }

            if (includes(type, ['choice', 'multichoice'])) {
                const { added = [], selected } = choice || {};
                const { record: r, changes: c } = reduce(
                    ({ record, changes }, selected) => {
                        const cfg = find({ uuid: selected }, option.options);
                        if (cfg === undefined) {
                            throw `Can't find '${selected}' option in '${type} ${uuid}'`;
                        }
                        const {
                            record: r,
                            changes: c,
                        } = CollectChanges([ cfg ], choices, path);
                        return {
                            record: {...record, ...r},
                            changes: [...changes, ...c],
                        };
                    },
                    { record: {}, changes: [] }
                )(type === 'choice'
                    ? (selected ? [selected] : [])
                    : added
                );
                record[uuid] = choice || true;
                return {
                    record: {...record, ...r},
                    changes: [...changes, ...c],
                };
            }

            if (type === 'config') {
                const {
                    record: r,
                    changes: c,
                } = CollectChanges(option.config, choices, path);
                record[uuid] = choice || true;
                return {
                    record: {...record, ...r},
                    changes: [...changes, ...c],
                };
            }

            throw `Unknown option type: '${type} ${uuid}'`;
        },
        { changes: [], record: {} }
    )(config);
};
