import {
    entries,
    every,
    flow,
    get,
    isArray,
    intersection,
    some,
} from 'lodash/fp';

export const MatchesFilters = function(item, filters) {
    return flow(entries, every(
        ([path, cond]) => {
            if (path.match(/_(formula|default)$/)) {
                return true;
            }
            if (path === 'or') {
                return some(
                    option => MatchesFilters(item, option)
                )(cond);
            }
            if (path === 'and') {
                return MatchesFilters(item, cond);
            }
            if (path === 'not') {
                return !MatchesFilters(item, cond);
            }
            const value = get(path, item);
            return intersection(
                isArray(value) ? value : [value],
                isArray(cond) ? cond : [cond],
            ).length;
        }
    ))(filters);
};

export default MatchesFilters;
