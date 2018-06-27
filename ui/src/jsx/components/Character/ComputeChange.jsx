import _ from 'lodash';

export default function ComputeChange(changes, original) {
    return _.reduce(changes, (change, {path, value, option}) => {
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
                _.get(original, root)
            );
        }

        if (value === undefined) {
            return change;
        }

        const current = _.get(change.props, path);
        let update = null;

        if (
            value === null
            || _.includes(
                ['value', 'select'],
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
            throw "Unknown option type: " + option;
        }

        change.props = _.set(change.props, path, update);

        return change;
    }, {props: {}, state: {}});
}
