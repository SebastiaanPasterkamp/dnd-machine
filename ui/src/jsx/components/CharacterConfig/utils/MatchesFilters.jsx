import {
    entries,
    every,
    find,
    flow,
    get,
    isArray,
    intersection,
    some,
} from 'lodash/fp';

const filterMethods = {
    absolute: function({ item, field, condition }) {
        return get(field, item) === condition;
    },
    and: function({ item, filters }) {
        return MatchesFilters(item, filters);
    },
    intersection: function({ item, field, options }) {
        const value = get(field, item);
        return intersection(
            isArray(value) ? value : [value],
            isArray(options) ? options : [options],
        ).length;
    },
    proficiency: function({ item, objects }) {
        if (!item) {
            return false;
        }
        const { id, type } = item;
        return (
            find({id, type}, objects) !== undefined
            || find({id: type}, objects) !== undefined
        );
    },
    or: function({ item, filters }) {
        return some(
            filter => MatchesFilters(item, [filter])
        )(filters);
    },
};

export const MatchesFilters = function(item, filters) {
    return every(
        ({ method = 'intersection', ...filter }) => {
            if (!(method in filterMethods)) {
                console.error(`Invalid filter '${method}'`, filter);
                return false;
            }
            return filterMethods[method]({item, ...filter});
        }
    )(filters);
};

export default MatchesFilters;
