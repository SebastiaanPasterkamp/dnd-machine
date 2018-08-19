import _ from 'lodash';

export default function ComputeChange(changes, original, start={}) {
    return _.chain(changes)
        .pickBy((fields, id) => fields !== undefined)
        .reduce((character, {path, value, option}) => {
            const root = _.split(path, '.')[0];
            if (_.isNil(character[root])) {
                character[root] = _.cloneDeep(
                    _.get(original, root)
                );
            }

            if (value === undefined) {
                return character;
            }

            const current = _.get(character, path);
            let update = null;

            if (
                value === null
                || _.includes(
                    ['value', 'select', 'manual'],
                    option.type
                )
            ) {
                update = value;
            } else if (option.type == 'dict') {
                update = _.assign({}, current || {}, value);
            } else if (option.type == 'list') {
                update = _.difference(
                    current || [],
                    value.removed
                );
                update = _.concat(update, value.added);
                if (!option.multiple) {
                    update = _.uniq(update);
                }
            } else {
                throw "Unknown option type: " + JSON.stringify(option);
            }

            return _.set(character, path, update);
        }, _.clone(start))
        .value();
}
